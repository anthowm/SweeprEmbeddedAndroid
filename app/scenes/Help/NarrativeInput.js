import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
  Image,
  Alert,
  NativeModules
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Voice from "react-native-voice-sweepr";
import _ from "lodash";
import Icon from "react-native-vector-icons/Entypo";
import TextField from "../../components/Form/TextField";
import config from "../../Styles/config";
import { Titles, Paragraphs } from "../../Styles/Text";
import { controlLabel } from "../../Styles/Form";
import VoiceInput from "../../components/VoiceInput/VoiceInput";
import ActiveNetwork from "../../components/VoiceInput/ActiveNetwork";
import { sweeprResolution } from "../../scenes/Resolutions/IssueClarification";
import { ApplicationSelector } from "../../reducers/application";

const { ThemeColors, FontFamily, Status, Buttons, Image: Img } = config;

export class NarrativeInput extends Component {
  constructor(props) {
    super(props);

    this.doKeyboardSubmit = this.doKeyboardSubmit.bind(this);
    this.onKeyboardPress = this.onKeyboardPress.bind(this);
    this.onMicPress = this.onMicPress.bind(this);
    this.resetResults.bind(this);
    this.createIncidentFromRemoteNotification.bind(this);

    if (props.inputMode != "KEYBOARD") {
      this.voiceStartListening();
    }

    this.state = {
      devicesHaveScanned: false,
      narrative: "", // narrative we inherit
      inputMode: props.inputMode,
      actions: props.actions,
      notificationData: props.notificationData,
      lastIncident: { id: 0 },
      keyboardText: "",
      recognized: false,
      pitch: "",
      error: "",
      end: false,
      notificationToken: props.notificationToken,
      started: false,
      results: [],
      partialResults: [],
      needsAnimation: false
    };
  }

  voiceStartListening() {
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
  }

  willShowVoiceView() {
    this.voiceStartListening();
  }

  willShowKeyboardView() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  createIncidentFromRemoteNotification() {
    if (!_.isEmpty(this.props.notificationData)) {
      const data = this.props.notificationData;
      const incidentRespnse = {
        IncidentType: "HandoverResolution",
        id: data.id,
        mqttTopic: data.mqttTopic,
        narrative: data.narrative
      };

      sweeprResolution.resetSubscription();

      Alert.alert(
        "Continue resolution..",
        "Do you wish to continue the resolution '" + data.narrative + "'?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "OK",
            onPress: () =>
              this.props.incidentActions.createRemoteIncident(incidentRespnse)
          }
        ],
        { cancelable: false }
      );
      // reset the notification to an empty object
      this.props.appActions.resetRemoteNotification({});
    }
  }

  componentDidMount() {
    const { id: householdID } = this.props.screenProps.currentHousehold;
    if (!this.state.devicesHaveScanned) {
      this.props.deviceActions.startDevicesScan(householdID);
      this.setState({
        devicesHaveScanned: true
      });
    }

    this.props.appActions.updateAPNSToken(this.state.notificationToken);
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart(e) {
    this.setState({
      started: true
    });
  }

  onSpeechRecognized(e) {
    this.setState({
      recognized: true
    });
  }

  onSpeechEnd(e) {
    this.setState({
      end: true
    });
    this.sendVoiceIncident();
  }

  onSpeechError(e) {
    const errorMsg = e.error.message;
    const errorStr = errorMsg.includes("203")
      ? "Ooops. I didnt quite catch that"
      : errorMsg;

    this.setState({
      needsAnimation: false,
      error: errorStr,
      results: [],
      partialResults: []
    });
  }

  onSpeechResults(e) {
    this.setState({
      results: e.value
    });
  }

  onSpeechPartialResults(e) {
    this.setState({
      partialResults: e.value
    });
  }

  onSpeechVolumeChanged(e) {
    this.setState({
      pitch: e.value
    });
  }

  async startRecognizing(e) {
    this.setState({ needsAnimation: true });
    this.resetResults();
    try {
      const locale = "en_US";
      await Voice.start(locale);
    } catch (e) {
      console.error(e);
    }
  }

  async stopRecognizing(e) {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  async cancelRecognizing(e) {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  }

  async destroyRecognizer(e) {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.resetResults();
  }

  resetResults() {
    this.setState({
      narrative: "", // narrative we inherit
      recognized: false,
      pitch: "",
      error: "",
      end: false,
      started: false,
      results: [],
      lastIncident: { id: 0 },
      partialResults: []
    });
  }

  sendVoiceIncident() {
    // the voice results list is an array of recognised text in best guess order
    let array = this.state.results;
    if (array.length > 0) {
      let text = array[0];
      if (_.isEmpty(text) || !text.length) {
        return;
      }
      const { id: householdID } = this.props.screenProps.currentHousehold;
      sweeprResolution.resetSubscription();

      // posts a narrative input of the best guess voice recognition
      this.props.incidentActions.createIncident(text, householdID);
    }
  }

  doKeyboardSubmit() {
    // called from a keyboard return - sends a narrative input
    this.setState({ needsAnimation: true });
    this.setState({ error: "" });
    const { id: householdID } = this.props.screenProps.currentHousehold;
    sweeprResolution.resetSubscription();

    this.props.incidentActions.createIncident(
      this.state.keyboardText,
      householdID
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.incident.lastCreatedIncidentError)) {
      this.processIncidentResponse(nextProps.incident);
    } else {
      if (
        nextProps.incident.lastCreatedIncident.id !==
        this.props.incident.lastCreatedIncident.id
      ) {
        this.processIncidentResponse(nextProps.incident);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.lastIncident.id != this.state.lastIncident.id) {
      if (!_.isEmpty(this.state.narrative)) {
        this.props.navigation.navigate("IssueClarification", {
          term: this.state.narrative
        });
        this.setState({ needsAnimation: false });
      }
    }
    if (!_.isEmpty(this.props.notificationData)) {
      this.createIncidentFromRemoteNotification();
    }
  }

  processIncidentResponse(incident) {
    if (!_.isEmpty(incident.lastCreatedIncident)) {
      this.setState({
        narrative: incident.lastCreatedIncident.narrative,
        error: ""
      });
      this.setState({ lastIncident: incident.lastCreatedIncident });
    } else if (!_.isEmpty(incident.lastCreatedIncidentError)) {
      this.setState({ needsAnimation: false });
      this.setState({
        error: incident.lastCreatedIncidentError.message,
        narrative: ""
      });
    }
  }

  onKeyboardPress() {
    this.willShowKeyboardView();
    this.state.inputMode = "KEYBOARD";
    this.setState({ state: this.state });
    this.setState({ error: "" });
  }

  onMicPress() {
    this.willShowVoiceView();
    this.state.inputMode = "VOICE";
    this.setState({ state: this.state });
    this.setState({ error: "" });
  }

  renderErrorText() {
    return (
      <View style={[error.container]}>
        <Text
          style={[Paragraphs.standard, Paragraphs.error, styles.textCenter]}
        >
          {this.state.error}
        </Text>
      </View>
    );
  }

  // renderCircularProgress() {
  //   return this.state.needsAnimation && <CircularProgress /> || null;
  // }

  renderActivityIndicator() {
    return !this.state.activityOver ? (
      <Animated.View
        style={[activity.container, { opacity: this.state.fadeAnim }]}
      >
        <ActivityIndicator
          animating={this.state.needsAnimation}
          style={[styles.loader, { height: 80 }]}
          size="large"
          color={Status.activity.indicator}
        />
        {this.state.needsAnimation && (
          <Text style={[Titles.sub, styles.textCenter]}>Waiting...</Text>
        )}
      </Animated.View>
    ) : null;
  }

  renderActiveNetworkBar() {
    const { networkConnection } = this.props;
    const { currentHousehold } = this.props.screenProps;
    return (
      <View style={[top.container]}>
        <ActiveNetwork
          currentHousehold={currentHousehold}
          networkConnection={networkConnection}
        />
      </View>
    );
  }

  renderBottomBar() {
    return (
      <View style={[bottom.container]}>
        <TouchableHighlight
          onPress={this.onMicPress}
          underlayColor={"transparent"}
        >
          <Image
            style={microphoneIcon.icon}
            color={ThemeColors.icon.bottomPanel}
            source={Img.bottomBar.microphone}
          />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.onKeyboardPress}
          underlayColor={"transparent"}
        >
          <Image
            style={keyboardIcon.icon}
            color={ThemeColors.icon.bottomPanel}
            source={Img.bottomBar.keyboard}
          />
        </TouchableHighlight>
      </View>
    );
  }

  renderVoiceView() {
    return (
      <View style={voice.container}>
        <View style={voice.description}>
          <Text style={[Titles.main, styles.textCenter]}>
            How can I help you?
          </Text>
        </View>

        <VoiceInput
          isListening={this.state.needsAnimation}
          onPressIn={this.startRecognizing.bind(this)}
          onPressOut={this.stopRecognizing.bind(this)}
        />

        <View style={voice.result}>
          {this.state.results.map(result => {
            const k = `key-${result.replace(/\W/gi, "-").toLowerCase()}`;
            return (
              <Text
                key={k}
                style={[
                  Paragraphs.standard,
                  styles.textCenter,
                  styles.resultText
                ]}
              >
                {result}
              </Text>
            );
          })}
          {_.isEmpty(this.state.results) && (
            <Text
              style={[
                Paragraphs.standard,
                Paragraphs.placeholder,
                styles.textCenter,
                styles.startText
              ]}
            >
              Press button to start
            </Text>
          )}
        </View>
        {this.renderActivityIndicator()}
        {this.renderErrorText()}
      </View>
    );
  }

  renderKeyBoardView() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={inputScreenContainer.container}
      >
        <View style={keyboard.description}>
          <Text style={[Titles.main, styles.textCenter]}>
            How can I help you?
          </Text>
        </View>
        <View style={keyboard.input}>
          <TextInput
            style={[styles.textField, styles.shadow]}
            onChangeText={keyboardText => this.setState({ keyboardText })}
            value={this.state.term}
            placeholder="Tell us about your problem..."
            keyboardType="default"
            autoFocus={true}
            autoCapitalize="none"
            returnKeyLabel="next"
            autoCorrect={false}
            onSubmitEditing={this.doKeyboardSubmit}
          />
        </View>
        {this.renderActivityIndicator()}
        {this.renderErrorText()}
      </KeyboardAwareScrollView>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderActiveNetworkBar()}
        {this.state.inputMode === "KEYBOARD" && this.renderKeyBoardView()}
        {this.state.inputMode !== "KEYBOARD" && this.renderVoiceView()}
        {this.renderBottomBar()}
      </View>
    );
  }
}

const inputScreenContainer = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1
  }
});

const voice = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1
  },
  description: {
    flex: 1,
    justifyContent: "flex-end"
  },
  buttonImage: {
    width: 150,
    height: 150
  },
  result: {
    flex: 1
  }
});

const microphoneIcon = StyleSheet.create({
  icon: {
    width: 48,
    height: 40
  }
});

const keyboardIcon = StyleSheet.create({
  icon: {
    marginTop: 5,
    width: 48,
    height: 40
  }
});

const keyboard = StyleSheet.create({
  container: {
    flex: 1
  },
  description: {
    flex: 2,
    justifyContent: "flex-end"
  },
  input: {
    flex: 2
  }
});

const activity = StyleSheet.create({
  container: {
    flex: 1
  }
});

const error = StyleSheet.create({
  container: {
    flex: 1
  }
});

const top = StyleSheet.create({
  container: {
    height: 50,
    marginBottom: 10
  }
});

const bottom = StyleSheet.create({
  container: {
    height: 40,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal: 30,
    backgroundColor: ThemeColors.spatial.containerBG
  },
  startText: {
    fontFamily: FontFamily.bold,
    fontSize: 18
  },
  resultText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18
  },
  textCenter: {
    textAlign: "center"
  },
  label: {
    fontSize: 24,
    fontWeight: "100"
  },
  textField: {
    height: 60,
    borderRadius: 4,
    borderColor: ThemeColors.text.primary,
    borderWidth: 1,
    fontFamily: FontFamily.regular,
    fontSize: 18,
    paddingHorizontal: 20,
    backgroundColor: ThemeColors.spatial.containerBG // Performance boost for shadow
  },
  shadow: {
    shadowColor: ThemeColors.shade.standard,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 0.1
  },
  loader: {
    alignItems: "center",
    justifyContent: "center"
  }
});

export default NarrativeInput;
