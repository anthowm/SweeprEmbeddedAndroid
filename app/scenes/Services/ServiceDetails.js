import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { Images } from '../../lib/Static.utils';
import S from '../../lib/Strings';
import config from '../../Styles/config';
const { ThemeColors, FontFamily } = config;

export class ServiceInfoItem extends Component {
  render() {
    return (
      <View style={ServiceInfoItemStyles.container}>
        <Text style={styles.fieldTitle}>{S.service[this.props.item.field]}</Text>
        <Text style={styles.fieldValue}>{this.props.item.value}</Text>
      </View>
    );
  }
}

const ServiceInfoItemStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 18
  }
});

class ServiceDetails extends Component {
  getServiceImage(item) {
    // TODO: Refactor service/device image request using utils lib.
    if (!item) return 'https://hippo.dev.sweepr.com/site/restservices/image?domain=service&type=square';
    return `https://hippo.dev.sweepr.com/site/restservices/image?domain=service&${item}&type=square`;
  }

  render() {
    const service = this.props.service;
    const ImageSource = { uri: this.getServiceImage(service.cmsImageQuery) };

    return (
      <View style={styles.container}>
        <Image style={styles.serviceImage} source={ImageSource} />
        <View style={styles.mainInfo}>
          <View style={styles.mainInfoCol}>
            <Text style={styles.fieldTitle}>Service status</Text>
            <Text style={styles.fieldValue}>{this.props.service.status}</Text>
          </View>
          <View style={styles.mainInfoCol}>
            <Text style={[styles.fieldTitle, styles.alignRight]}>Last down</Text>
            <Text style={[styles.fieldValue, styles.alignRight]}>{this.props.service.lastDownTime}</Text>
          </View>
        </View>
        <FlatList
          data={this.props.service.infoList}
          style={styles.infoList}
          renderItem={({ item }) => <ServiceInfoItem key={item.key} item={item} />} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center'
  },
  serviceImage: {
    width: 200,
    height: 200
  },
  mainInfo: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 25
  },
  mainInfoCol: {
    flex: 1
  },
  fieldTitle: {
    fontFamily: FontFamily.light,
    fontSize: 12,
    paddingVertical: 5
  },
  fieldValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18
  },
  alignRight: {
    textAlign: 'right'
  },
  infoList: {
    backgroundColor: '#f9f9f9',
    width: '100%',
    paddingHorizontal: 25,
    paddingVertical: 20
  },
  label: {
    fontSize: 15,
    color: '#4d4a60'
  }
});

export default ServiceDetails;
