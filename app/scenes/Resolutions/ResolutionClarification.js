import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  NativeModules,
  NativeEventEmitter,
  Easing,
  Image,
  FlatList
} from 'react-native';
import _ from 'lodash';
import Button from 'apsl-react-native-button';
import ResolutionCard from './ResolutionCard';
import DeviceListItem from '../../components/List/DeviceListItem';
import CircularProgress from '../../components/Loaders/CircularProgress';
import { button, button_secondary, buttonText, buttonText_secondary } from '../../Styles/Form';
import { Titles } from '../../Styles/Text';
import config from '../../Styles/config';
import Strings from '../../lib/Strings.json';
const { ThemeColors, Progress: Progr, Status } = config;
const SpeechBox = {
  statement: require('../../../images/speech-box.statement.png'),
  question: require('../../../images/speech-box.question.png'),
  warning: require('../../../images/speech-box.warning.png'),
  info: require('../../../images/speech-box.info.png'),
  failure: require('../../../images/speech-box.failure.png')
};

export const sweeprResolution = NativeModules.SweeprResolution;
const sweeprResolutionEvt = new NativeEventEmitter(sweeprResolution);

const enumContent = 0,
  enumPrompt = 1,
  enumCardContent = 2,
  enumDevices = 3;

export default class ResolutionClarification extends Component {
  constructor(props) {
    super(props);

    this.unlistenToResolutionResponseEvents.bind(this);
    this.secondaryButton = this.secondaryButton.bind(this);
    this.finalise = this.finalise.bind(this);
    this.getPromptImage = this.getPromptImage.bind(this)
    this.renderPromptButtons = this.renderPromptButtons.bind(this)


    this.state = {
      narrative: '',
      subType:'Statement',
      subPrompt:'',
      isContent: enumContent,
      incident: props.navigation.state.params.incident,
      hasDelay: 3,
      progress: 'indeterminate',
      resolutionFinished: false,
      buttonText: { primaryButton: 'OK', secondaryButton: 'Cancel' , continueOnSecondaryButton: false}
    };
  }

  componentDidMount() {
    this.listenToResolutionResponseEvents();
    sweeprResolution.respondToResolution();
  }

  componentWillUnmount() {
    this.unlistenToResolutionResponseEvents();
  }

  unlistenToResolutionResponseEvents() {
    this.contentListener.remove();
    this.promptListener.remove();
    this.cardContentListener.remove();
    this.resolutionListener.remove();
    this.resolutionStartListener.remove();
    this.affectedDevicesListener.remove();
  }

  listenToResolutionResponseEvents() {
    this.resolutionStartListener = sweeprResolutionEvt.addListener(
      'RCTStartResolution',
      (textResponse) => {
        sweeprResolution.respondToResolution();
      }
    );

    this.affectedDevicesListener = sweeprResolutionEvt.addListener(
      'RCTAffectedDeviceList',
      (deviceResponse) => {
        let buttonText = !_.isEmpty(deviceResponse.buttonText)
          ? {
              primaryButton: deviceResponse.buttonText.primaryButton,
              secondaryButton: deviceResponse.buttonText.secondaryButton,
              continueOnSecondaryButton: deviceResponse.buttonText.continueOnSecondaryButton
            }
          : { primaryButton: 'OK', secondaryButton: 'Cancel' ,continueOnSecondaryButton: false };

        this.setState({
          devices: deviceResponse.devices,
          isContent: enumDevices,
          narrative: 'Device List Placeholder',
          buttonText
        });
      }
    );

    this.contentListener = sweeprResolutionEvt.addListener('RCTContentResponse', (textResponse) => {
      this.setState({
        narrative: textResponse.text,
        isContent: enumContent,
        hasDelay: textResponse.delay,
        progress: textResponse.progress
      });
    });

    this.promptListener = sweeprResolutionEvt.addListener('RCTPromptResponse', (textResponse) => {
      this.setState({
        narrative: textResponse.text,
        subType:textResponse.subType,
        subPrompt:textResponse.subPrompt,
        isContent: enumPrompt
      });

      if (!_.isEmpty(textResponse.buttonText)) {
        this.setState({
          buttonText: {
            primaryButton: textResponse.buttonText.primaryButton,
            secondaryButton: textResponse.buttonText.secondaryButton,
            continueOnSecondaryButton: textResponse.buttonText.continueOnSecondaryButton
          }
        });
      } else {
        this.setState({
          buttonText: { primaryButton: 'OK', secondaryButton: 'Cancel' , continueOnSecondaryButton:false }
        });
      }
    });

    this.failedResponseListener = sweeprResolutionEvt.addListener(
      'RCTFailedResponse',
      (textResponse) => {
        this.setState({
          narrative: textResponse.text,
          isContent: enumPrompt,
          resolutionFinished: true
        });
      }
    );

    this.cardContentListener = sweeprResolutionEvt.addListener(
      'RCTCardContentResponse',
      (cardResponse) => {
        this.setState({
          isContent: enumCardContent,
          cardContainers: cardResponse.cardContainers
        });
      }
    );

    this.resolutionListener = sweeprResolutionEvt.addListener(
      'RCTResolutionAuditResponse',
      (response) => {
        const { id: householdID } = this.props.screenProps.currentHousehold;
        const incident = { incident: this.state.incident };
        const resolution = _.merge({}, response, incident);
        const resolutionFinished = response.resolutionFinished;
        this.setState({ resolutionFinished });
        this.props.resolutionActions.sendResolutionResponse({
          audit: resolution,
          householdID
        });

        if (resolutionFinished) this.props.navigation.popToTop();
      }
    );
  }

  finalise() {
    sweeprResolution.respondToButton(true);
    if (this.state.resolutionFinished) this.props.navigation.popToTop();
  }

  secondaryButton() {
    if ((this.state.buttonText.continueOnSecondaryButton) == false) {
      this.props.navigation.popToTop();
    }
    sweeprResolution.respondToButton(false);
  }

  renderContent() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: ThemeColors.spatial.containerBG }}>
        <View style={Content.container}>
          <View style={Content.title}>
            <Text style={[Titles.main, { textAlign: 'center' }]}>{this.state.narrative}</Text>
          </View>
          <View style={Content.indicator}>
            <CircularProgress />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  renderCard() {
    const cardList = this.state.cardContainers.map((card) => {
      const k = `key-${card.title.replace(/\W/gi, '-').toLowerCase()}`;
      return <ResolutionCard key={k} data={card} onCardFinalise={this.finalise} />;
    });

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: ThemeColors.spatial.containerBG }}>
        <View style={Card.container}>{cardList}</View>
      </SafeAreaView>
    );
  }

  getPromptImage(type){
    switch (type) {
      case 'Statement':
        return SpeechBox.statement;
      case 'Question':
        return SpeechBox.question;
      case 'Warning':
        return SpeechBox.warning;
      case 'Info':
        return SpeechBox.info;
      case 'Failure':
        return SpeechBox.failure;
      default:
      return SpeechBox.statement;
    }
  }

  renderPromptButtons(){
    if (_.isEmpty(this.state.buttonText.secondaryButton) == false){
      return (
          <View style={Prompt.interaction}>
          <Button style={[button, { marginBottom: 20 }]} onPress={this.finalise}>
            <Text style={buttonText}>{this.state.buttonText.primaryButton}</Text>
          </Button>
          <Button style={[button_secondary, { marginBottom: 0 }]} onPress={this.secondaryButton}>
            <Text style={buttonText_secondary}>{this.state.buttonText.secondaryButton}</Text>
          </Button>
        </View>
      );
    } else {
      return (
          <View style={Prompt.interaction}>
          <Button style={[button, { marginBottom: 0 }]} onPress={this.secondaryButton}>
            <Text style={buttonText}>{this.state.buttonText.primaryButton}</Text>
          </Button>
        </View>
      );
    }
  }

  renderPrompt() {
    const promptImage = this.getPromptImage(this.state.subType)
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: ThemeColors.spatial.containerBG }}>
        <View style={[Prompt.container]}>
          <View style={[Prompt.content]}>
            <Image source={promptImage} style={Prompt.icon} />
            <Text style={[Titles.main, { textAlign: 'center' }]}>{this.state.narrative}</Text>
            <Text style={[Titles.secondary, { textAlign: 'center' }]}>{this.state.subPrompt}</Text>
          </View>
          {this.renderPromptButtons()}
        </View>
      </SafeAreaView>
    );
  }

  renderDeviceList() {
    const dv = _.map(this.state.devices, (d) => _.assign({}, d, { key: `key-${d.id}` }));
    return (
      <View style={List.container}>
        <FlatList
          data={dv}
          style={List.list}
          renderItem={({ item }) => (
            <DeviceListItem item={item} onPress={null}>
              {item.name}
            </DeviceListItem>
          )}
        />
        <Button style={[button, List.button]} onPress={this.finalise}>
          <Text style={buttonText}>{this.state.buttonText.primaryButton}</Text>
        </Button>
      </View>
    );
  }

  render() {
    switch (this.state.isContent) {
      case enumContent:
        return this.renderContent();
      case enumPrompt:
        return this.renderPrompt();
      case enumCardContent:
        return this.renderCard();
      case enumDevices:
        return this.renderDeviceList();
      default:
        return this.renderContent();
    }
  }
}

const List = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: ThemeColors.spatial.containerBG
  },
  list: {
    paddingHorizontal: 30,
    paddingTop: 10
  },
  button: {
    marginHorizontal: 30,
    marginBottom: 35
  }
});

const Prompt = StyleSheet.create({
  container: {
    backgroundColor: ThemeColors.spatial.containerBG,
    height: '100%',
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

const Content = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: ThemeColors.spatial.containerBG,
    flexDirection: 'column',
    paddingHorizontal: 30
  },
  title: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  indicator: {
    marginTop: 20,
    flex: 2,
  }
});

const Card = StyleSheet.create({
  container: {
    backgroundColor: ThemeColors.spatial.containerBG,
    height: '100%',
    flexDirection: 'column'
  }
});
