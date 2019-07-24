import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import ServiceList from '../../components/List/ServiceList';
import _ from 'lodash';
import config from '../../Styles/config';
const { ThemeColors, FontFamily, Status } = config;

class Services extends Component {
  constructor(props) {
    super(props);
    this.addService = this.addService.bind(this);
    this.serviceDeletion = this.serviceDeletion.bind(this);
    this.scheduleServiceDeletion = this.scheduleServiceDeletion.bind(this);
    this.showHouseholdServices = this.showHouseholdServices.bind(this);
    this.showServiceList = this.showServiceList.bind(this);
    this.press = this.press.bind(this);
    this.state = {
      householdServices: [],
      services: [],
      showHouseholdServices: true,
      showServiceList: false
    };
  }

  static defaultProps = {
    currentHousehold: null
  };

  componentWillMount() {
    if (!_.isEmpty(this.props.currentHousehold)) {
      this.props.servicesActions.fetchHouseholdServices(this.props.currentHousehold.id, 0);
    }
    this.props.servicesActions.fetchServices(0);
  }

  componentWillReceiveProps(nextProps) {
    const { services, householdServices } = nextProps;
    const syncedServices = _.map(services, service => {
      let addedService = _.get(_.find(householdServices, householdService => householdService.id === service.id), 'added', false);
      return _.assign({}, service, { added: addedService });
    });

    this.setState({
      services: syncedServices,
      householdServices: nextProps.householdServices,
    });
  }

  showHouseholdServices() {
    this.setState({ showHouseholdServices: true, showServiceList: false });
  }

  showServiceList() {
    this.setState({ showServiceList: true, showHouseholdServices: false });
  }

  addService(serviceID) {
    this.props.servicesActions.addServiceToHousehold(this.props.currentHousehold.id, serviceID);
  }

  scheduleServiceDeletion(serviceID) {
    this.props.servicesActions.scheduleHouseholdServiceForDeletion(serviceID);
  }

  serviceDeletion(serviceID) {
    this.props.servicesActions.removeServiceFromHousehold(
      this.props.currentHousehold.id,
      serviceID
    );
  }

  press(service) {
    this.props.navigation.navigate('ServiceDetails');
    this.props.servicesActions.fetchSelectedService(service);
  }

  renderLists() {
    const lists = (
      <View style={styles.lists}>
        <ServiceList
          style={{ paddingTop: 10 }}
          remove={this.scheduleServiceDeletion}
          removeCallback={this.serviceDeletion}
          services={this.state.householdServices}
          onPress={this.press}
          switchToServiceList={this.showServiceList}
          show={this.state.showHouseholdServices}
        />
        <ServiceList
          style={{ paddingTop: 10 }}
          add={this.addService}
          services={this.state.services}
          onPress={this.press}
          show={this.state.showServiceList}
        />
      </View>
    );

    const indicator = (
      <ActivityIndicator
        animating={this.props.serviceProcesses.fetchServices}
        size="large"
        color={Status.activity.indicator}
        style={{ marginTop: 35 }}
      />
    );

    return this.props.serviceProcesses.fetchingServices ||
      this.props.householdServiceProcesses.fetchingServices
      ? indicator
      : lists;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.section}>
          <View style={styles.labelWrapper}>
            <Text style={styles.servicesLabel}>Services</Text>
          </View>
        </View>

        <View style={styles.labelsOuter}>
          <TouchableHighlight
            style={[styles.labelPress, styles.labelCol]}
            onPress={this.showHouseholdServices}
            underlayColor='transparent'>
            <Text
              style={[styles.label, this.state.showHouseholdServices ? styles.activeLabel : null]}>
              My Services
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.labelPress, styles.labelCol]}
            onPress={this.showServiceList}
            underlayColor='transparent'>
            <Text
              style={[styles.label, this.state.showServiceList ? styles.activeLabel : null]}>
              Service list
            </Text>
          </TouchableHighlight>
        </View>
        <ScrollView>
          {this.renderLists()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColors.spatial.containerBG,
    height: '100%'
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  servicesLabel: {
    fontFamily: FontFamily.semiBold,
    color: ThemeColors.text.featured,
    fontSize: 24,
    lineHeight: 26
  },
  lists: {
    marginTop: 14
  },
  labelsOuter: {
    backgroundColor: ThemeColors.spatial.sectionBackground,
    flexDirection: 'row',
    marginTop: 14
  },
  labelCol: {
    flex: 1
  },
  label: {
    fontFamily: FontFamily.regular,
    textAlign: 'center',
    fontSize: 14,
    color: ThemeColors.text.label
  },
  activeLabel: {
    fontFamily: FontFamily.semiBold,
    color: ThemeColors.text.primary
  },
  labelPress: {
    paddingVertical: 12
  }
});

export default Services;
