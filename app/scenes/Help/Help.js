import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  ActivityIndicator,
  Image
} from "react-native";
import _ from "lodash";
import Icon from "react-native-vector-icons/Entypo";
import Button from "apsl-react-native-button";
import DeviceListItem from "../../components/List/DeviceListItem";
import TextField from "../../components/Form/TextField";
import {
  button,
  buttonText,
  button_secondary,
  buttonText_secondary
} from "../../Styles/Form";
import { Scanner } from "../../routers/PrivateRouter";
import Voice from "react-native-voice-sweepr";
import { NativeModules } from "react-native";
import config from "../../Styles/config";
import { Borders } from "../../Styles/Helpers";
const { ThemeColors, Status } = config;
const voice = NativeModules.Voice;

export class HelpWithDevice extends Component {
  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.startProblemFlow = this.startProblemFlow.bind(this);
    this.renderDevicesList = this.renderDevicesList.bind(this);
    this.renderDeviceCheck = this.renderDeviceCheck.bind(this);
    this.renderConnectionSpeedCheck = this.renderConnectionSpeedCheck.bind(
      this
    );
    this.renderDoorbellSpeedCheck = this.renderDoorbellSpeedCheck.bind(this);
    this.renderDoorbellDeviceWorking = this.renderDoorbellDeviceWorking.bind(
      this
    );
    this.renderDeviceReconnect = this.renderDeviceReconnect.bind(this);
    this.renderDeviceOKConfirm = this.renderDeviceOKConfirm.bind(this);
    this.renderDeviceOKConfirmed = this.renderDeviceOKConfirmed.bind(this);
    this.renderIssueCreated = this.renderIssueCreated.bind(this);
    this.performScan = this.performScan.bind(this);
    this.onPressFaqItem = this.onPressFaqItem.bind(this);
    this.postIncidentAndResolutionAttempts = this.postIncidentAndResolutionAttempts.bind(
      this
    );

    this.state = {
      gamingService: "Fortnite",
      term: "", // Search/Filter term
      filtered: [], // List of devices matching term
      list: [], // Fist of all devices
      item: null, // Selected device to investigate
      activity: "LIST_DEVICES",
      faqList: [],
      resolutionAttempts: []
    };
  }

  static defaultProps = {
    term: "",
    connected: []
  };

  componentWillMount() {
    this.performScan();
    // TODO: Re-build the structure that fetches CMS content
    // to call the `fetchCMScontent` only when it is required
    // by a device

    this.props.deviceActions.fetchCMScontent({
      query: "ringdoorbell",
      nodetype: "sweeprcms:faqitem",
      attributes: "sweeprcms:answer,sweeprcms:question"
    });
    this.setState({
      term: this.props.navigation.state.params.term,
      filtered: this.filteredValues(
        this.props.navigation.state.params.term,
        this.props.connected
      ),
      list: this.props.connected
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      term: nextProps.navigation.state.params.term,
      list: nextProps.connected,
      filtered: this.filteredValues(
        nextProps.navigation.state.params.term,
        nextProps.connected
      ),
      faqList: nextProps.faq
    });
  }

  sanitisedResolutionAttempts(list) {
    return _.map(list, attempt => {
      return _.pick(attempt, [
        "status",
        "dateAttempt",
        "speedTestResult",
        "auditSummary",
        "step"
      ]);
    });
  }

  setResolutionAttempts(allItems) {
    this.resolutionAttempts = allItems;
  }

  pushResolutionAttempt(item) {
    let resolutionAttempts = this.resolutionAttempts
      ? this.resolutionAttempts.slice(0)
      : [];

    let template = {
      dateAttempt: Date.now(),
      status: null,
      step: resolutionAttempts.length + 1
    };
    resolutionAttempts.push(_.assign(template, item));

    // Handles duplicate checks.
    // (if same resolution was attempted twice, reject the duplicate)
    let types = [];
    resolutionAttempts = _.reject(resolutionAttempts, attempt => {
      let result = _.some(types, type => {
        return attempt.type === type;
      });
      types.push(attempt.type);
      return result;
    });

    this.setResolutionAttempts(resolutionAttempts);
  }

  performScan() {
    this.props.deviceActions.clearLocalDevices();
    Scanner.setup();
    Scanner.startLanScan(this.props.screenProps.mode.inDemoMode);
  }

  filteredValues(term, list) {
    return _.filter(list, item => {
      let rgx = new RegExp(term, "gi");
      let idMatch = rgx.test(item.id);
      let nameMatch = rgx.test(item.name);
      let typeMatch = new RegExp(item.origin.deviceType, "gi").test(term);
      let matchedDeviceOrService = false;

      if (this.isGamingDevice(item)) {
        matchedDeviceOrService = _.some(
          ["fortnite", "fortnight", this.state.gamingService],
          matchTerm => {
            return new RegExp(matchTerm, "gi").test(term);
          }
        );
      }

      if (this.isDoorbellDevice(item)) {
        matchedDeviceOrService = _.some(
          ["ring", "ring.com", "doorbell", "ringdoorbell"],
          matchTerm => {
            return new RegExp(matchTerm, "gi").test(term);
          }
        );
      }

      return idMatch || nameMatch || typeMatch || matchedDeviceOrService;
    });
  }

  onChangeText(term) {
    let textFiltered = this.filteredValues(term, this.state.list);

    if (term.length > 0) {
      if (textFiltered.length === 0) {
        textFiltered = this.state.list;
      }
    }

    this.setState({
      term: term,
      filtered: textFiltered
    });
  }

  startProblemFlow(item) {
    this.setState({ activity: "CHECK_DEVICE", item });
  }

  setStateAfter(activity, ms) {
    setTimeout(() => {
      this.setState({ activity });
    }, ms);
  }

  isGamingDevice(item) {
    return (
      item.origin.deviceType === "playstation" ||
      item.origin.deviceType === "xbox"
    );
  }

  isDoorbellDevice(item) {
    return item.origin.deviceType === "ringdoorbell";
  }

  renderActivityScreen(label) {
    return (
      <View style={[styles.container, styles.centeredContent, styles.content]}>
        <Text
          style={[styles.label, styles.textCenter, styles.stepSectionMargin]}
        >
          {label}
        </Text>
        <ActivityIndicator
          style={styles.stepSectionMargin}
          size="large"
          color={Status.activity.indicator}
        />
      </View>
    );
  }

  onPressFaqItem(item) {
    this.props.navigation.navigate("DeviceFAQDetails", item);
  }

  definitionListItem({ item }) {
    return (
      <TouchableHighlight
        onPress={() => {
          this.onPressFaqItem(item);
        }}
        underlayColor={ThemeColors.spatial.containerBG}
      >
        <View style={styles.itemWrapper}>
          <View style={[Borders.top, styles.section]}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderFaqList() {
    return this.state.faqList && this.state.faqList.length > 0 ? (
      <FlatList
        data={this.state.faqList}
        renderItem={item => {
          return this.definitionListItem(item);
        }}
      />
    ) : (
      <Text style={[styles.section, styles.body]}>
        Could not find FAQ for this device.
      </Text>
    );
  }

  // LIST_DEVICES
  renderDevicesList() {
    return (
      <ScrollView style={[styles.container, styles.content]}>
        <TextField
          placeholder={"Filter.."}
          icon="magnifying-glass"
          onClear={() => {
            this.onChangeText("");
          }}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={this.onChangeText}
          value={this.state.term}
          styleOuter={{ marginBottom: 30 }}
        />
        <Text style={[styles.label, styles.stepSectionMargin]}>
          What device did you mean?
        </Text>
        <FlatList
          data={this.state.filtered}
          style={{ overflow: "visible" }}
          renderItem={({ item }) => (
            <DeviceListItem onPress={this.startProblemFlow} item={item} />
          )}
        />
        <Button style={button_secondary} onPress={this.performScan}>
          <Text style={buttonText_secondary}>Refresh Devices</Text>
        </Button>
      </ScrollView>
    );
  }

  // CHECK_DEVICE
  renderDeviceCheck() {
    if (this.isGamingDevice(this.state.item)) {
      this.setStateAfter("GO_NEAR_DEVICE", 3000);
    } else if (this.isDoorbellDevice(this.state.item)) {
      this.setStateAfter("CHECK_DOORBELL_SPEED", 3000);
    } else {
      this.setStateAfter("RECONNECT_DEVICE", 3700);
    }

    this.pushResolutionAttempt({
      type: "CHECK_DEVICE",
      auditSummary: `Checked connectivity of ${this.state.item.name}.`,
      status: "Successful"
    });
    return this.renderActivityScreen(
      `Checking ${this.state.item.name} connectivity...`
    );
  }

  // CHECK_GAMING_SPEED
  renderConnectionSpeedCheck() {
    if (!this.speedTestDone) {
      this.speedTestDone = Boolean(true);
      this.props.speedTestActions.requestSpeedTestWithURL(
        "http://speedtest.sweepr.com/files/testData.dmg"
      );
    } else if (this.props.speedTest.activity != "WORKING") {
      let speed = this.props.speedTest.measure / (1024 * 1024); //TODO: calculate this properly
      if (speed > 5) {
        this.pushResolutionAttempt({
          type: "CHECK_GAMING_SPEED",
          auditSummary: "Connection speed check completed, result positive.",
          speedTestResult: { speed: this.props.speedTest.measure },
          status: "Successful"
        });
        this.setStateAfter("CHECK_GAMING_LATENCY", 3000);
      } else {
        this.pushResolutionAttempt({
          type: "CHECK_GAMING_SPEED",
          auditSummary: "Connection speed check completed, result negative.",
          speedTestResult: { speed: this.props.speedTest.measure },
          status: "Failed"
        });
        this.setStateAfter("PRIORITISE_CONNECTION", 3000);
      }
    }

    return this.renderActivityScreen("Testing connection speed...");
  }

  // CHECK_DOORBELL_SPEED
  renderDoorbellSpeedCheck() {
    if (!this.speedTestDone) {
      this.speedTestDone = Boolean(true);
      this.props.speedTestActions.requestSpeedTestWithURL(
        "http://speedtest.sweepr.com/files/testData.dmg"
      );
    } else if (this.props.speedTest.activity !== "WORKING") {
      this.pushResolutionAttempt({
        type: "CHECK_DOORBELL_SPEED",
        auditSummary: `Checked doorbell response speed (latency).`,
        status: "Successful"
      });
      this.setStateAfter("REPORT_WORKING_DEVICE", 3000);
    }

    return this.renderActivityScreen(
      `Testing ${this.state.item.name} speed...`
    );
  }

  // REPORT_WORKING_DEVICE
  renderDoorbellDeviceWorking() {
    return (
      <View style={[styles.container, styles.centeredContent, styles.content]}>
        <Text
          style={[styles.label, styles.textCenter, styles.stepSectionMargin]}
        >
          Your are all set to go!
        </Text>
        <Button
          style={button}
          onPress={() => {
            this.pushResolutionAttempt({
              type: "TROUBLESHOOT_DOORBELL_DEVICE",
              auditSummary: `Doorbell working, confirmed.`,
              status: "Successful"
            });
            this.props.navigation.navigate("Home");
          }}
        >
          <Text style={buttonText}>Ok</Text>
        </Button>
        <Button
          style={button_secondary}
          onPress={() => {
            this.setState({ activity: "TROUBLESHOOT_DOORBELL_DEVICE" });
          }}
        >
          <Text style={buttonText_secondary}>I still have more questions</Text>
        </Button>
      </View>
    );
  }

  // TROUBLESHOOT_DOORBELL_DEVICE
  renderDoorbellDeviceTroubleshoot() {
    this.pushResolutionAttempt({
      type: "TROUBLESHOOT_DOORBELL_DEVICE",
      auditSummary: `Offered user to read FAQ for ${this.state.item.name}.`,
      status: "Failed"
    });
    return (
      <View style={styles.container}>
        <Text
          style={[styles.label, styles.textCenter, styles.stepSectionMargin]}
        >
          {`Sorry we couldn't\nautomatically fix this wifi\nconnectivity issue`}
        </Text>
        <Text
          style={[styles.label, styles.textCenter, styles.stepSectionMargin]}
        >
          {`We have found content for Ring\nDoorbell to help:`}
        </Text>
        <ScrollView>{this.renderFaqList()}</ScrollView>
      </View>
    );
  }

  // CHECK_GAMING_LATENCY
  renderGamingLatencyCheck() {
    if (!this.pingTestDone) {
      this.pingTestDone = Boolean(true);
      this.props.pingTestActions.requestPingTest();
    } else if (this.props.pingTest.activity != "WORKING") {
      // Render methods that are not pure functions causes a warning in React.
      // Since this is just for demo, I'll leave this how it is. When we
      // implement final solution, we'll remove most of this code.
      if (this.props.pingTest.measure < 150) {
        this.pushResolutionAttempt({
          type: "CHECK_GAMING_LATENCY",
          auditSummary: "Gaming speed check (latency ping) completed.",
          speedTestResult: { latency: this.props.pingTest.measure },
          status: "Successful"
        });
        this.setStateAfter("CHECK_REMOTE_SERVER", 1500);
      } else {
        this.pushResolutionAttempt({
          type: "CHECK_GAMING_LATENCY",
          auditSummary: "Gaming speed check (latency ping) completed.",
          speedTestResult: { latency: this.props.pingTest.measure },
          status: "Failed"
        });
        this.setStateAfter("PRIORITISE_CONNECTION", 1500);
      }
    }

    return this.renderActivityScreen("Testing gaming speed...");
  }

  // CHECK_TWITTER_REPORTS
  renderTwitterReportsCheck() {
    this.pushResolutionAttempt({
      type: "CHECK_TWITTER_REPORTS",
      auditSummary: `Checked Twitter feed for reported issues on ${
        this.state.gamingService
      }. No reports found.`,
      status: "Successful"
    });
    this.setStateAfter("FOUND_NO_ISSUES", 4300);
    return this.renderActivityScreen(
      `Checking Twitter for ${this.state.gamingService} reported issues..`
    );
  }

  // GO_NEAR_DEVICE
  renderGoNearDevice() {
    return (
      <View style={[styles.container, styles.centeredContent, styles.content]}>
        <Text
          style={[styles.label, styles.textCenter, styles.stepSectionMargin]}
        >
          Please go near this device.
        </Text>
        <Text
          style={[styles.label, styles.textCenter, styles.stepSectionMargin]}
        >
          It will help us finding any connection issues.
        </Text>

        <Button
          style={[button, styles.stepSectionMargin]}
          onPress={() => {
            this.pushResolutionAttempt({
              type: "GO_NEAR_DEVICE",
              auditSummary: `User went near ${this.state.item.name}.`,
              status: "Successful"
            });
            this.setState({ activity: "CHECK_GAMING_SPEED" });
          }}
        >
          <Text style={buttonText}>Done</Text>
        </Button>
      </View>
    );
  }

  // CHECK_REMOTE_SERVER
  renderRemoteServersCheck() {
    this.pushResolutionAttempt({
      type: "CHECK_REMOTE_SERVER",
      auditSummary: `Checked remote servers for ${this.state.gamingService}.`,
      status: "Successful"
    });
    this.setStateAfter("CHECK_TWITTER_REPORTS", 3700);
    return this.renderActivityScreen(
      `Checking ${this.state.gamingService} service..`
    );
  }

  // PRIORITISE_CONNECTION
  renderPrioritiseConnection() {
    return (
      <View style={[styles.container, styles.centeredContent, styles.content]}>
        <Text
          style={[styles.label, styles.textCenter, styles.stepSectionMargin]}
        >
          Your Network is too slow right now.
        </Text>
        <Text
          style={[styles.label, styles.textCenter, styles.stepSectionMargin]}
        >
          Would you like us to give this activity priority on your home
          internet?
        </Text>

        <Button
          style={[button, styles.stepSectionMargin]}
          onPress={() => {
            this.pushResolutionAttempt({
              type: "PRIORITISE_CONNECTION",
              auditSummary: `Prompted for prioritised connection. User chose to give priority.`,
              status: "Successful"
            });
            this.setState({ activity: "RECONNECT_DEVICE" });
          }}
        >
          <Text style={buttonText}>Give Priority</Text>
        </Button>
        <Button
          style={button_secondary}
          onPress={() => {
            this.pushResolutionAttempt({
              type: "PRIORITISE_CONNECTION",
              auditSummary: `Prompted for prioritised connection. User chose to NOT give priority, but cancel.`,
              status: "Failed"
            });
            this.setState({ activity: "LIST_DEVICES" });
          }}
        >
          <Text style={buttonText_secondary}>Cancel</Text>
        </Button>
      </View>
    );
  }

  // RECONNECT_DEVICE
  renderDeviceReconnect() {
    this.pushResolutionAttempt({
      type: "RECONNECT_DEVICE",
      auditSummary: `Attempted to reconnect device.`,
      status: "Successful"
    });
    this.setStateAfter("CONFIRM_DEVICE_OK", 3400);
    return this.renderActivityScreen(`Reconnecting...`);
  }

  // CONFIRM_DEVICE_OK
  renderDeviceOKConfirm() {
    return (
      <View style={[styles.container, styles.centeredContent, styles.content]}>
        <Text
          style={[styles.label, styles.textCenter, styles.stepSectionMargin]}
        >
          Please confirm if {this.state.item.name} is working properly.
        </Text>
        <Button
          style={[button, styles.stepSectionMargin]}
          onPress={() => {
            this.pushResolutionAttempt({
              type: "CONFIRM_DEVICE_OK",
              auditSummary: `Prompt user to confirm device works.`,
              status: "Successful"
            });
            this.setState({ activity: "SHOW_DEVICE_OK" });
          }}
        >
          <Text style={buttonText}>{"It's all working"}</Text>
        </Button>
        <Button
          style={button_secondary}
          onPress={() => {
            this.pushResolutionAttempt({
              type: "CONFIRM_DEVICE_OK",
              auditSummary: `Prompt user to confirm device works.`,
              status: "Failed"
            });
            this.setState({ activity: "SHOW_ISSUE_CREATED" });
          }}
        >
          <Text style={buttonText_secondary}>{"Report an issue"}</Text>
        </Button>
      </View>
    );
  }

  // SHOW_DEVICE_OK
  renderDeviceOKConfirmed() {
    return (
      <View style={[styles.container, styles.centeredContent, styles.content]}>
        <Text
          style={[styles.label, styles.textCenter, styles.stepSectionMargin]}
        >
          You are all set to go!
        </Text>
        <Button
          style={button}
          onPress={() => {
            this.pushResolutionAttempt({
              type: "SHOW_DEVICE_OK",
              auditSummary: `Device confirmed as OK, resolution attempts concluded, no further actions.`,
              status: "Successful"
            });
            this.props.navigation.navigate("Home");
          }}
        >
          <Text style={buttonText}>{"OK!"}</Text>
        </Button>
      </View>
    );
  }

  // SHOW_3RD_PARTY_ERROR
  render3rdPartyError() {
    this.pushResolutionAttempt({
      type: "SHOW_3RD_PARTY_ERROR",
      auditSummary: `Notify user of service (${
        this.state.gamingService
      }) experiencing trouble.`
    });
    return (
      <View style={[styles.container, styles.centeredContent, styles.content]}>
        <Text
          style={[styles.label, styles.textCenter, styles.stepSectionMargin]}
        >
          {`The ${
            this.state.gamingService
          } service is slow or may be down, with response times of ${
            this.props.pingTest.result
          }, please raise this issue with ${this.state.gamingService}.`}
        </Text>
        <Button
          style={[button, styles.stepSectionMargin]}
          onPress={() => {
            this.setState({ activity: "LIST_DEVICES" });
          }}
        >
          <Text style={buttonText}>{"Got it"}</Text>
        </Button>
      </View>
    );
  }

  // SHOW_ISSUE_CREATED
  renderIssueCreated() {
    this.pushResolutionAttempt({
      type: "SHOW_ISSUE_CREATED",
      auditSummary: `Reported incident, resolution attempts concluded, no further actions.`
    });
    this.postIncidentAndResolutionAttempts();
    return (
      <View style={[styles.container, styles.centeredContent, styles.content]}>
        <Text
          style={[styles.label, styles.textCenter, styles.stepSectionMargin]}
        >
          We have reported this issue and will get back to you within 24 hours.
        </Text>
        <Button
          style={button}
          onPress={() => {
            this.props.navigation.navigate("Home");
          }}
        >
          <Text style={buttonText}>{"Thanks"}</Text>
        </Button>
      </View>
    );
  }

  // FOUND_NO_ISSUES
  renderFoundNoIssues() {
    return (
      <View style={[styles.container, styles.centeredContent, styles.content]}>
        <Text
          style={[styles.label, styles.textCenter, styles.stepSectionMargin]}
        >
          {"We have checked and everything seems to be working fine."}
        </Text>
        <Text
          style={[styles.label, styles.textCenter, styles.stepSectionMargin]}
        >
          {`If you still have problems, we could report an issue with ${
            this.state.gamingService
          } service providers.`}
        </Text>
        <Button
          style={button}
          onPress={() => {
            this.pushResolutionAttempt({
              type: "FOUND_NO_ISSUES",
              auditSummary: `User reported issue.`
            });
            this.setState({ activity: "SHOW_ISSUE_CREATED" });
          }}
        >
          <Text style={buttonText}>Report an issue</Text>
        </Button>
        <Button
          style={button_secondary}
          onPress={() => {
            this.props.navigation.navigate("Home");
          }}
        >
          <Text style={buttonText_secondary}>Cancel</Text>
        </Button>
      </View>
    );
  }

  postIncidentAndResolutionAttempts() {
    // Picks (and removes) first step, performs that action
    // continues like this with all steps, until done.
    // Then deletes recordings of steps and tests.
    const performNextAction = list => {
      let step = list.shift();
      setTimeout(() => {
        // this.props.deviceActions.createResolutionAttempt(this.props.incident.lastCreatedIncident.id, step)
        if (list.length > 0) {
          performNextAction(list);
        } else {
          delete this.resolutionAttempts;
          delete this.speedTestDone;
          delete this.pingTestDone;
        }
      }, 100);
    };

    // Posts incident, then posts resolution attempts.
    if (!this.incidentReported) {
      if (this.attemptsPosted) {
        return null;
      } else if (this.props.incident.lastCreatedIncident.id) {
        this.attemptsPosted = true;
        let payloadList = this.sanitisedResolutionAttempts(
          this.resolutionAttempts
        );
        performNextAction(payloadList);
      } else {
        console.warn(
          "No incident ID to add steps to.",
          this.resolutionAttempts
        );
      }
    } else {
      this.incidentReported = true;
      // this.props.deviceActions.devicesCreateIncident(this.state.item, this.state.term)
    }
  }

  render() {
    switch (this.state.activity) {
      case "LIST_DEVICES":
        return this.renderDevicesList();
      case "GO_NEAR_DEVICE":
        return this.renderGoNearDevice();
      case "CHECK_DEVICE":
        return this.renderDeviceCheck();
      case "CHECK_GAMING_SPEED":
        return this.renderConnectionSpeedCheck();
      case "CHECK_GAMING_LATENCY":
        return this.renderGamingLatencyCheck();
      case "CHECK_DOORBELL_SPEED":
        return this.renderDoorbellSpeedCheck();
      case "REPORT_WORKING_DEVICE":
        return this.renderDoorbellDeviceWorking();
      case "TROUBLESHOOT_DOORBELL_DEVICE":
        return this.renderDoorbellDeviceTroubleshoot();
      case "CHECK_TWITTER_REPORTS":
        return this.renderTwitterReportsCheck();
      case "CHECK_REMOTE_SERVER":
        return this.renderRemoteServersCheck();
      case "PRIORITISE_CONNECTION":
        return this.renderPrioritiseConnection();
      case "RECONNECT_DEVICE":
        return this.renderDeviceReconnect();
      case "CONFIRM_DEVICE_OK":
        return this.renderDeviceOKConfirm();
      case "SHOW_DEVICE_OK":
        return this.renderDeviceOKConfirmed();
      case "SHOW_3RD_PARTY_ERROR":
        return this.render3rdPartyError();
      case "SHOW_ISSUE_CREATED":
        return this.renderIssueCreated();
      case "FOUND_NO_ISSUES":
        return this.renderFoundNoIssues();
      default:
        return <Text>Unhandled Help state.</Text>;
    }
  }
}
