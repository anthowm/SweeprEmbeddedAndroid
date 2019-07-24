import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import config from '../../Styles/config';
const { ThemeColors } = config;

class TermsAndConditions extends Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.h1}>Sweepr Terms and Conditions</Text>

        <Text style={styles.h2}>License</Text>

        <Text style={styles.paragraph}>
          Unless otherwise stated, swpr and/or it’s licensors own the intellectual property rights
          for all material on swpr. All intellectual property rights are reserved. You may view
          and/or print pages from http://swpr.com for your own personal use subject to restrictions
          set in these terms and conditions.
        </Text>

        <Text style={styles.paragraph}>
          Redistribute content from swpr (unless content is specifically made for redistribution).
        </Text>

        <Text style={styles.h2}>Content Liability</Text>

        <Text style={styles.paragraph}>
          We shall have no responsibility or liability for any content appearing on your Web site.
          You agree to indemnify and defend us against all claims arising out of or based upon your
          Website. No link(s) may appear on any page on your Web site or within any context
          containing content or materials that may be interpreted as libelous, obscene or criminal,
          or which infringes, otherwise violates, or advocates the infringement or other violation
          of, any third party rights.
        </Text>

        <Text style={styles.h2}>Disclaimer</Text>

        <Text style={styles.paragraph}>
          To the maximum extent permitted by applicable law, we exclude all representations,
          warranties and conditions relating to our website and the use of this website (including,
          without limitation, any warranties implied by law in respect of satisfactory quality,
          fitness for purpose and/or the use of reasonable care and skill).
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 25,
    paddingBottom: 25,
    backgroundColor: ThemeColors.spatial.containerBG
  },
  h1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20
  },
  h2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20
  },
  paragraph: {
    marginBottom: 20
  }
});

export default TermsAndConditions;
