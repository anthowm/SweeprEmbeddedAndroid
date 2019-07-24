import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  FlatList,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import TextField from '../../components/Form/TextField';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import DeviceAssets from '../../lib/DeviceAssets';
import config from '../../Styles/config';
import { Borders } from '../../Styles/Helpers';
const { ThemeColors } = config;

/**
 * Device FAQ
 */

class DeviceFAQ extends Component {
  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.onPress = this.onPress.bind(this);

    this.state = {
      searchTerm: null,
      filtered: [],
      meta: props.navigation.state.params.meta,
      deviceType: this.props.navigation.state.params.params.item.origin.deviceType
    };
  }

  componentDidMount() {
    this.props.actions.fetchCMScontent({
      query: this.state.deviceType,
      nodetype: 'sweeprcms:faqitem',
      attributes: 'sweeprcms:answer,sweeprcms:question'
    });
  }

  componentWillReceiveProps(nextProps) {
    let faqList = nextProps.faq;
    this.setState({ list: faqList, filtered: faqList, searchTerm: null });
  }

  getDeviceImage(item) {
    return DeviceAssets.getDeviceImage(item);
  }

  onPress(item) {
    this.props.navigation.navigate('DeviceFAQDetails', item);
  }

  onChangeText(term = null) {
    this.setState({
      searchTerm: term,
      filtered: term ? this.filteredValues(term, this.state.list) : this.state.list
    });
  }

  filteredValues(term, list) {
    return _.filter(list, (item) => {
      let rgx = new RegExp(term, 'gi');
      let titleMatch = rgx.test(item.title);
      let bodyMatch = rgx.test(item.body);
      return titleMatch || bodyMatch;
    });
  }

  definitionList({ item }) {
    return (
      <TouchableHighlight
        onPress={() => {
          this.onPress(item);
        }}
        underlayColor={ThemeColors.spatial.containerBG}>
        <View style={[Borders.top, styles.section, { flexDirection: 'row' }]}>
          <View style={{ flex: 9 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderList() {
    return this.state.filtered && this.state.filtered.length > 0 ? (
      <FlatList
        data={this.state.filtered}
        renderItem={(item) => {
          return this.definitionList(item);
        }}
      />
    ) : (
      <Text style={[styles.section, styles.body]}>Could not find FAQ for this device.</Text>
    );
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
          <Image source={this.getDeviceImage(this.props.navigation.state.params.params.item)} />
        </View>
        <View style={styles.firstSection}>
          <TextField
            placeholder={'Filter...'}
            style={styles.searchBoxField}
            icon="magnifying-glass"
            onClear={() => {
              this.onChangeText('');
            }}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={this.onChangeText}
            value={this.state.searchTerm}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.mainTitle}>Top answers</Text>
        </View>
        {this.renderList()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColors.spatial.containerBG
  },
  mainTitle: {
    fontSize: 16,
    fontFamily: 'karbon-light',
    color: ThemeColors.text.primary
  },
  section: {
    paddingVertical: 20,
    marginHorizontal: 20
  },
  firstSection: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    paddingTop: 22
  },
  searchBoxField: {
    fontFamily: 'karbon-light',
    fontSize: 18
  },
  title: {
    fontFamily: 'karbon-light',
    fontSize: 20,
    color: ThemeColors.text.primary,
    lineHeight: 24,
    fontWeight: 'bold'
  },
  body: {
    fontFamily: 'karbon-light',
    fontSize: 18,
    color: ThemeColors.text.primary,
    lineHeight: 24,
    marginBottom: 5
  },
  searchBox: {
    fontFamily: 'karbon-regular',
    borderColor: ThemeColors.spatial.separatorBorder,
    borderWidth: 1,
    height: 50,
    backgroundColor: ThemeColors.spatial.containerBG,
    borderRadius: 5
  }
});

export default DeviceFAQ;
