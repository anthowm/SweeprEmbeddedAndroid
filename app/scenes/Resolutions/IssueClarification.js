import React, { Component } from 'react';
import _ from 'lodash';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  ScrollView,
  NativeEventEmitter,
  Animated,
  ActivityIndicator,
  NativeModules
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DeviceClarificationListItem from '../../components/List/DeviceClarificationListItem';
import IssueClarificationListItem from '../../components/List/IssueClarificationListItem';
import Strings from '../../lib/Strings.json';
import config from '../../Styles/config';
import { Titles } from '../../Styles/Text';
import Button from 'apsl-react-native-button';
import { button, button_secondary, buttonText, buttonText_secondary } from '../../Styles/Form';
const { ThemeColors, Status } = config;

export const sweeprResolution = NativeModules.SweeprResolution;
const sweeprResolutionEvt = new NativeEventEmitter(sweeprResolution);

export default class IssueClarification extends Component {
  constructor(props) {
    super(props);
    this.listenToIncidentResponseEvents();

    this.onKeyboardPress = this.onKeyboardPress.bind(this);
    this.onMicPress = this.onMicPress.bind(this);

    this.state = {
      term: props.navigation.state.params.term,
      deviceSuggested: false,
      list: [],
      messageType: '',
      incident: props.incident.lastCreatedIncident,
      incidentError: {},
      needsAnimation: true,
      timedOut: false,
      buttonText: { primaryButton: 'Yes', secondaryButton: 'No' }
    };
  }

  componentDidMount() {
    // TODO: remove the need for this timtout.
    setTimeout(() => {
      this.setState({
        needsAnimation: false,
        timedOut: true
      });
    }, 5000);
  }

  componentWillUnmount() {
    this.listener.remove();
    this.props.incidentActions.unSubscribeToIncident(this.state.incident.id);
  }

  componentWillReceiveProps(nextProps) {
    this.processIncidentResponse(nextProps.incident);
  }

  sortListBy(list) {
    const moveToTop = _.find(list, { id: -1 }) || false;
    if (moveToTop) {
      list.unshift(moveToTop);
      list.pop();
    }
    return list;
  }

  listenToIncidentResponseEvents() {
    this.listener = sweeprResolutionEvt.addListener('RCTSweeprIncidentReceived', (incident) => {
      this.setState({
        deviceSuggested: incident.deviceSuggested || false,
        list: this.sortListBy(incident.messageContent),
        messageType: incident.messageType,
        needsAnimation: false
      });
    });

    this.resolutionStartListener = sweeprResolutionEvt.addListener(
      'RCTStartResolution',
      (textResponse) => {
        this.resolutionStartListener.remove();
        this.props.navigation.replace('ResolutionClarification', {
          incident: this.state.incident.id
        });
      }
    );
  }

  processIncidentResponse(incident) {
    if (!_.isEmpty(incident.lastCreatedIncident))
      this.setState({ incident: incident.lastCreatedIncident });

    if (!_.isEmpty(incident.lastCreatedIncidentError))
      this.setState({ incidentError: incident.lastCreatedIncidentError });
  }

  onItemPress(item) {
    switch (this.state.messageType) {
      case 'ISSUE_CLARIFICATION_REQUEST':
        this.props.incidentActions.sendIssueResponse(item.id, this.state.incident.id);
        break;

      case 'DEVICE_CLARIFICATION_REQUEST':
        this.props.incidentActions.sendDeviceResponse(item.id, this.state.incident.id);
        break;

      case 'SERVICE_CLARIFICATION_REQUEST':
        this.props.incidentActions.sendServiceResponse(item.id, this.state.incident.id);
        break;

      default:
        console.log('OnItemPress called with incorrect message type');
        break;
    }
  }

  // TODO: refactor these to a goBack method.
  // or just supply this callback directly in render.
  onKeyboardPress() {
    this.props.navigation.goBack();
  }

  onMicPress() {
    this.props.navigation.goBack();
  }

  // TODO: move to render method.
  getIssueCustomListItems(item, navigation) {
    return (
      <IssueClarificationListItem
        item={item}
        onPress={() => {
          this.onItemPress(item);
        }}
        navigation={navigation}
        actions={this.props.deviceActions}>
        {item.name}
      </IssueClarificationListItem>
    );
  }

  getServiceCustomListItems(item, navigation) {
    return (
      <IssueClarificationListItem
        item={item}
        onPress={() => {
          this.onItemPress(item);
        }}
        navigation={navigation}
        actions={this.props.deviceActions}>
        {item.name}
      </IssueClarificationListItem>
    );
  }

  getDeviceCustomListItems(item, navigation) {
    return (
      <DeviceClarificationListItem
        item={item}
        onPress={() => {
          this.onItemPress(item);
        }}
        navigation={navigation}
        actions={this.props.deviceActions}>
        {item.name}
      </DeviceClarificationListItem>
    );
  }

  getCustomListItems(item, navigation) {
    switch (this.state.messageType) {
      case 'ISSUE_CLARIFICATION_REQUEST':
      case 'SERVICE_CLARIFICATION_REQUEST':
        return this.getIssueCustomListItems(item, navigation);

      case 'DEVICE_CLARIFICATION_REQUEST':
        return this.state.deviceSuggested
          ? this.renderSuggestedDevice(item, navigation)
          : this.getDeviceCustomListItems(item, navigation);

      default:
        return this.getDeviceCustomListItems(item, navigation);
    }
  }

  deviceSuggestionInput(item, deviceSuggested) {
    const incidentID = this.state.incident.id;
    const itemID = item.id;
    this.props.incidentActions.deviceSuggestionInput({ incidentID, itemID, deviceSuggested });
  }

  renderSuggestedDevice(item, navigation) {
    return (
      <View style={[Prompt.container]}>
        <View style={[Prompt.content]}>
          <Text style={[Titles.main, { textAlign: 'center' }]}>{item.name}</Text>
        </View>
        <View style={Prompt.interaction}>
          <Button
            style={[button, { marginBottom: 20 }]}
            onPress={() => this.deviceSuggestionInput(item, this.state.deviceSuggested)}>
            <Text style={buttonText}>{this.state.buttonText.primaryButton}</Text>
          </Button>
          <Button
            style={[button_secondary, { marginBottom: 0 }]}
            onPress={() => this.deviceSuggestionInput(item, !this.state.deviceSuggested)}>
            <Text style={buttonText_secondary}>{this.state.buttonText.secondaryButton}</Text>
          </Button>
        </View>
      </View>
    );
  }

  // TODO: move to render method.
  renderErrorText() {
    const failed = this.state.timedOut && this.state.list && this.state.list.length === 0;
    if (failed) {
      return (
        <View style={[styles.errorContent]}>
          <Text style={[Titles.sub]}>The term "{this.state.term}" failed to get a resolution.</Text>
        </View>
      );
    }
  }

  render() {
    var _messageType = ""

    if (this.state.messageType  === 'DEVICE_CLARIFICATION_REQUEST') {
      if (this.state.list.length > 0) {
        _messageType = this.state.deviceSuggested
         ? 'DEVICE_CLARIFICATION_REQUEST_ALT'
         : 'DEVICE_CLARIFICATION_REQUEST';
     }
    } else if (this.state.messageType  === 'SERVICE_CLARIFICATION_REQUEST') {
      _messageType = 'SERVICE_CLARIFICATION_REQUEST'
    }




    const screenTitle = Strings['issue-clarification'][_messageType];
    const renderActivityIndicator = () => {
      if (!this.state.activityOver && this.state.needsAnimation) {
        return (
          <Animated.View style={[styles.overlay, { opacity: this.state.fadeAnim }]}>
            <ActivityIndicator
              animating={this.state.needsAnimation}
              style={[styles.loader, { height: 80 }]}
              size="large"
              color={Status.activity.indicator}
            />
            {this.state.needsAnimation && (
              <Text style={[Titles.sub, { textAlign: 'center' }]}>Waiting...</Text>
            )}
          </Animated.View>
        );
      }
    };

    return (
      <View style={styles.container}>
        <View>
          <Text style={Titles.main}>{screenTitle}</Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={this.state.list}
          style={{ paddingHorizontal: 10, paddingTop: 10, marginBottom: 20 }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.getCustomListItems(item, this.props.navigation)}
        />
        {this.renderErrorText()}
      </View>
    );
  }
}

const Prompt = StyleSheet.create({
  container: {
    backgroundColor: ThemeColors.spatial.containerBG,
    height: 400,
    justifyContent: 'space-between',
    paddingHorizontal: 30
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  interaction: {
    paddingBottom: 40
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 15
  }
});

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 10,
    backgroundColor: ThemeColors.spatial.containerBG
  },
  loader: {
    marginTop: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },
  errorContent: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
    flex: 1
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    zIndex: 1000
  }
});
