import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import ContentBox from '../../components/ContentBox/ContentBox';
import config from '../../Styles/config';
const { ThemeColors, FontFamily } = config;

/**
 * IssueClarificationListItem
 */

class IssueClarificationListItem extends Component {
  getServiceImage(item) {
    if (!item) return 'https://hippo.dev.sweepr.com/site/restservices/image?domain=service&type=square';
    return `https://hippo.dev.sweepr.com/site/restservices/image?domain=service&${item}&type=square`;
  }
  render() {
    const ImageSource = { uri: this.getServiceImage(this.props.item.cmsImageQuery) };

    return (
      <ContentBox style={styles.item}>
        <TouchableOpacity
          onPress={() => {
            this.props.onPress(this.props.item);
          }}
          underlayColor={'transparent'}>
          <View style={styles.itemInner}>
            <View style={styles.serviceImageWrapper}>
              <Image style={styles.serviceImage} source={ImageSource} />
            </View>
            <View style={styles.textView}>
              <Text style={styles.issueTitle}>{this.props.item.name}</Text>
              {this.props.item.description && <Text style={styles.issueDescription}>{this.props.item.description}</Text>}
            </View>
          </View>
        </TouchableOpacity>
      </ContentBox>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: ThemeColors.spatial.containerBG
  },
  itemInner: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white'
  },
  issueTitle: {
    fontFamily: FontFamily.light,
    fontSize: 15,
    marginBottom: 4,
    color: ThemeColors.text.featured
  },
  issueDescription: {
    fontFamily: FontFamily.light,
    fontSize: 12,
    marginBottom: 4,
    color: ThemeColors.text.primary
  },
  textView: {
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
});

export default IssueClarificationListItem;
