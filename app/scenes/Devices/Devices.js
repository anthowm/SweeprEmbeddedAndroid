import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
  TextInput,
  RefreshControl,
  TouchableHighlight
} from 'react-native';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import DeviceListItem from '../../components/List/DeviceListItem';
import TextField from '../../components/Form/TextField';
import { Scanner } from '../../routers/PrivateRouter';
import config from '../../Styles/config';
const { ThemeColors, FontFamily } = config;

/**
 * Devices scene, will be imported and used as container component
 */

class Devices extends Component {
  constructor(props) {
    super(props);
    this.getCustomListItems = this.getCustomListItems.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onItemPress = this.onItemPress.bind(this);
    this.performScan = this.performScan.bind(this);
    this.refresh = this.refresh.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);

    this.state = {
      showFilter: false,
      refreshing: false,
      searchTerm: '',
      filtered: [],
      list: []
    };
  }

  static defaultProps = {
    searchTerm: '',
    connected: []
  };

  componentDidMount() {
    this.performScan();
    this.setState({
      filtered: this.filteredValues(this.state.searchTerm, this.props.connected),
      list: this.props.connected
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      filtered: this.filteredValues(this.state.searchTerm, nextProps.connected),
      list: nextProps.connected
    });
  }

  performScan() {
    const { id: householdID } = this.props.screenProps.currentHousehold;
    this.props.deviceActions.clearLocalDevices();
    this.props.deviceActions.startDevicesScan(householdID);
  }

  filteredValues(term, list) {
    return _.filter(list, (item) => {
      let rgx = new RegExp(term, 'gi');
      let idMatch = rgx.test(item.id);
      let nameMatch = rgx.test(item.name);
      return idMatch || nameMatch;
    });
  }

  toggleFilter() {
    const { searchTerm, showFilter } = this.state;
    this.setState({
      searchTerm: !showFilter && '',
      filtered: this.filteredValues('', this.props.connected),
      showFilter: !showFilter
    });
  }

  onChangeText(term) {
    this.setState({
      searchTerm: term,
      filtered: term ? this.filteredValues(term, this.state.list) : this.state.list
    });
  }

  onItemPress(item) {
    this.props.navigation.navigate(
      'DeviceDetails',
      { item, selectedSkillLevel: this.props.selectedSkillLevel }
    );
  }

  getCustomListItems(item, navigation) {
    return (
      <DeviceListItem
        item={item}
        onPress={() => {
          this.onItemPress(item);
        }}
        navigation={navigation}
        actions={this.props.deviceActions}>
        {item.name}
      </DeviceListItem>
    );
  }

  refresh() {
    this.setState({ refreshing: true });
    this.performScan();
    setTimeout(() => this.setState({ refreshing: false }), 1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.section}>
          <View style={styles.labelWrapper}>
            <Text style={styles.devicesLabel}>Devices</Text>
          </View>
          <View style={styles.filterWrapper}>
            {this.state.showFilter && <TextInput
              style={styles.filterInput}
              placeholder={'Filter...'}
              autoFocus={this.state.showFilter}
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={this.onChangeText}
              value={this.state.searchTerm} />}
            </View>
            <TouchableHighlight
              style={styles.toggleWrapper}
              onPress={this.toggleFilter}
              underlayColor='transparent'>
              <View style={styles.filterButton}>
                <MaterialCommunityIcons
                  size={18}
                  name={this.state.showFilter
                    ? this.state.searchTerm && 'close-circle-outline'
                    : 'filter-outline'} />
                <Text style={styles.filterButtonText}>Filter</Text>
              </View>
            </TouchableHighlight>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />}>
          {this.state.filtered.length ? <FlatList
            data={this.state.filtered}
            style={styles.list}
            renderItem={({ item }) => this.getCustomListItems(item, this.props.navigation)} /> :
            <Text style={styles.noResults}>No results</Text>
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.spatial.containerBG,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  filterWrapper: {
    flexGrow: 1,
  },
  devicesLabel: {
    fontFamily: FontFamily.semiBold,
    color: ThemeColors.text.featured,
    fontSize: 24,
    lineHeight: 26
  },
  filterInput: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: FontFamily.light,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  list: {
    overflow: 'visible',
    marginBottom: 30
  },
  noResults: {
    fontFamily: FontFamily.light,
    textAlign: 'center'
  }
});

export default Devices;
