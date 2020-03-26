// @flow
import React, { Component } from 'react';
import {
  View, StyleSheet, Dimensions, Image, Text, TouchableOpacity,
} from 'react-native';

import { colors, images, ImageButton } from '../../../common/ui';

const SCREEN_H = Dimensions.get('window').height;
const MODAL_H = 440;

type Props = {
  navigation: NavigationScreenProp<*>,
};

export default class BatteryLowModal extends Component<Props> {
  onClose = () => {
    this.props.navigation.pop();
  };

  onContinue = () => {
    this.onClose();
    this.props.navigation.navigate('MeditationScreen');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.backgroundView} />
        <View style={styles.content}>
          <View style={styles.modalNavBar}>
            <ImageButton
              onPress={this.onClose}
              source={images.closeBackOpIcon}
            />
          </View>

          <Image
            style={styles.battery}
            source={images.batteryIcon}
          />

          <Text style={styles.headerText}>Attention.</Text>

          <Text style={styles.messageText}>
            Your battery is running low.
            Do not close the app before time is up.
          </Text>

          <View style={styles.btnsCont}>
            <TouchableOpacity
              style={styles.btn}
              onPress={this.onContinue}
            >
              <Text style={styles.btnText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btn}
              onPress={this.onClose}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backgroundView: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.blackBBOp,
  },

  content: {
    position: 'absolute',
    top: (SCREEN_H - MODAL_H) / 2,
    width: '94%',
    maxWidth: 330,
    height: MODAL_H,
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: colors.dark2,
  },

  modalNavBar: {
    height: 50,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },

  battery: {
    width: 60,
    height: 60,
    transform: [{ rotate: '-90deg' }],
    alignSelf: 'center',
  },

  headerText: {
    fontSize: 19,
    fontFamily: 'IBMPlexMono-Medium',
    color: colors.white,
    marginVertical: 16,
  },

  messageText: {
    fontSize: 13,
    lineHeight: 24,
    fontFamily: 'IBMPlexMono',
    color: colors.subText,
    textAlign: 'justify',
  },

  btnsCont: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 32,
  },

  btn: {
    borderColor: colors.white,
    borderWidth: 1,
    paddingHorizontal: 16,
    width: 110,
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: 'IBMPlexMono-Medium',
  },
});
