import React, { Component } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  Animated
} from 'react-native';
import Button from 'apsl-react-native-button';
import ContentBox from '../../components/ContentBox/ContentBox';
import AnimatedItem from '../../components/List/AnimatedItem';
import { Images } from '../../lib/Static.utils';
import { button, buttonText } from '../../Styles/Form';
import config from '../../Styles/config';
const { ThemeColors, FontFamily, Status } = config;
const AnimatedContentBox = AnimatedItem(ContentBox);

export class ServiceListItem extends Component {
  constructor(props) {
    super(props);
    this.actionPress = this.actionPress.bind(this);
    this.actionPressCallback = this.actionPressCallback.bind(this);
  }

  static defaultProps = {
    service: {},
    actionPress: () => console.log('Missing actionPress function for service.'),
    actionPressCallback: () => console.log('Missing actionPressCallback function for service.')
  };

  get statusTextColor() {
    return {
      ONLINE: Status.text.active
    }[this.props.service.status];
  }

  actionPress() {
    this.props.onActionPress(this.props.service.id);
  }

  actionPressCallback() {
    this.props.onActionPressCallback(this.props.service.id);
  }

  getServiceImage(item) {
    if (!item) return 'https://hippo.dev.sweepr.com/site/restservices/image?domain=service&type=square';
    return `https://hippo.dev.sweepr.com/site/restservices/image?domain=service&${item}&type=square`;
  }

  render() {
    const service = this.props.service;
    const ImageSource = { uri: this.getServiceImage(service.cmsImageQuery) };
    const serviceAction = () => {
      const { icon } = this.props;
      let renderSection = <Text style={styles.actionText}>{icon}</Text>;
      if (service.added && icon === '+') {
        renderSection = <Text style={styles.addedText}>✓</Text>;
      }
      return renderSection;
    }
    return (
      <AnimatedContentBox
        outerStyle={{ marginHorizontal: 20, marginBottom: 15 }}
        style={styles.container}
        shouldCollapse={this.props.service.scheduledForDeletion}
        onCollapseDone={this.actionPressCallback}>
        <TouchableHighlight
          style={[styles.col1]}
          onPress={() => {
            this.props.onPress(this.props.service);
          }}
          underlayColor='transparent'>
          <View style={styles.col1Inner}>
            <View style={styles.serviceImageWrapper}>
              <Image style={styles.serviceImage} source={ImageSource} />
            </View>
            <View style={styles.content}>
              <Text style={styles.serviceName}>{this.props.service.name}</Text>
              {this.props.service.status && <Text style={[styles.serviceStatus, { color: this.statusTextColor }]}>
                {this.props.service.status}
              </Text>}
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.col2, styles.actionArea]}
          onPress={service.added && this.props.icon === '+' ? null : this.actionPress}
          underlayColor="transparent">
          {serviceAction()}
        </TouchableHighlight>
      </AnimatedContentBox>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 8,
    paddingLeft: 8
  },
  col1: {
    flex: 1
  },
  col1Inner: {
    flexDirection: 'row'
  },
  col2: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  content: {
    flex: 1,
    justifyContent: 'center'
  },
  serviceImageWrapper: {
    marginRight: 10
  },
  serviceImage: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    resizeMode: 'contain'
  },
  serviceName: {
    fontFamily: FontFamily.light,
    fontSize: 15,
  },
  serviceStatus: {
    fontFamily: FontFamily.light,
    fontSize: 15,
    color: Status.text.active,
    marginTop: 4
  },
  actionArea: {
    paddingRight: 15
  },
  actionText: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  addedText: {
    fontSize: 30
  }
});

const ImageSource = require('../../../images/bg.sweepr.png');

class ServiceList extends Component {
  static defaultProps = {
    services: [],
    show: false
  };

  renderEmpty() {
    return (
      <View style={ListStyle.emptyOuter}>
        <View style={ListStyle.row1}>
          <Image
            style={{ width: '100%', height: '100%' }}
            source={ImageSource}
            resizeMethod="resize"
            resizeMode="contain"
          />
        </View>
        <View style={ListStyle.row2}>
          <Text style={ListStyle.emptyLabel}>
            {"You don't seem to have any services.\nPress below to add yours."}
          </Text>
        </View>
        <View style={ListStyle.row3}>
          <Button style={[button, ListStyle.emptyButton]} onPress={this.props.switchToServiceList}>
            <Text style={buttonText}>{'Add A Service'}</Text>
          </Button>
        </View>
      </View>
    );
  }

  renderList() {
    const { actionPress, actionPressCallback, icon } = this.props.add
      ? { actionPress: this.props.add, actionPressCallback: this.props.addCallback, icon: '+' }
      : {
          actionPress: this.props.remove,
          actionPressCallback: this.props.removeCallback,
          icon: '-'
        };
    return (
      <FlatList
        data={this.props.services}
        style={[{ overflow: 'visible' }, this.props.style]}
        renderItem={({ item }) => {
          return (
            <ServiceListItem
              onPress={this.props.onPress}
              icon={icon}
              onActionPress={actionPress}
              onActionPressCallback={actionPressCallback}
              service={item}
            />
          );
        }}
      />
    );
  }

  render() {
    if (this.props.show) {
      return this.props.services.length > 0 ? this.renderList() : this.renderEmpty();
    } else {
      return null;
    }
  }
}

const ListStyle = StyleSheet.create({
  emptyOuter: {
    flexDirection: 'column',
    flex: 1, // Sets full height
    marginHorizontal: 20,
    marginVertical: 35
  },
  emptyLabel: {
    textAlign: 'center',
    fontSize: 18,
    color: Status.text.inactive,
    marginBottom: 20
  },
  emptyButton: {
    marginBottom: 0
  },
  row1: {
    flex: 8
  },
  row2: {
    flex: 2,
    justifyContent: 'center'
  },
  row3: {
    height: 45,
    justifyContent: 'flex-end'
  }
});

export default ServiceList;
