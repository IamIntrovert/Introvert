// @flow
import React, { Component } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import moment from 'moment';

import { colors } from '../../../common/ui';

const ITEM_PADDING = 32;
const itemWidth = Dimensions.get('window').width;

type Props = {
  style: ?Object,
  filesInfo: Array<FileInfo>,
  onImagePress: (name: string) => void,
  onSelectedImageChanges: (name: string) => void,
  initSelectedName: string,
};

type State = {
  selectedName: string,
};

export default class HorizontalPicturesList extends Component<Props, State> {
  static defaultProps = {
    style: null,
  };

  static getDerivedStateFromProps(newProps: Props, prevState: State) {
    if (newProps.filesInfo.length > 0 && prevState.selectedName === '') {
      return {
        selectedName: newProps.filesInfo[0].name,
      };
    }

    return null;
  }

  $scrollView: ScrollView;

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedName: props.initSelectedName,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.$scrollView) {
        const { filesInfo } = this.props;
        const { selectedName } = this.state;
        const selectedIdx = filesInfo.findIndex(f => f.name === selectedName);

        this.$scrollView.scrollTo({
          y: 0,
          x: selectedIdx > 0 ? selectedIdx * itemWidth : 0,
          animated: true,
        });
      }
    }, 10);
  }

  shouldComponentUpdate(newProps: Props) {
    return newProps.filesInfo !== this.props.filesInfo;
  }

  onImagePress(selectedName: string) {
    this.setState({ selectedName });

    const { onImagePress } = this.props;
    if (onImagePress) {
      onImagePress(selectedName);
    }
  }

  onMomentumScrollEnd = (e: OnScrollEvent) => {
    const { contentOffset } = e.nativeEvent;
    const { filesInfo, onSelectedImageChanges } = this.props;

    const idx = Math.floor(Math.abs(contentOffset.x / itemWidth));
    const selectedName = filesInfo[idx] ? filesInfo[idx].name : '';
    if (onSelectedImageChanges) {
      onSelectedImageChanges(selectedName);
    }

    this.setState({ selectedName });
  };

  render() {
    const { filesInfo, style } = this.props;

    return (
      <View style={[styles.container, style]}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          // eslint-disable-next-line no-return-assign
          ref={r => this.$scrollView = r}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
        >
          {filesInfo.map(imageInfo => (
            <View
              style={styles.itemCont}
              key={`${imageInfo.name}${Math.random() * 1000000}`}
            >
              <TouchableOpacity
                style={styles.itemImageCont}
                onPress={() => this.onImagePress(imageInfo.name)}
                activeOpacity={1}
              >
                <Image
                  style={styles.itemImage}
                  source={{ uri: `file://${imageInfo.name}` }}
                />
              </TouchableOpacity>
              <Text style={styles.infoText}>
                {moment(imageInfo.date).format('DD.MM.YYYY')}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },

  itemCont: {
    width: itemWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemImageCont: {
    width: itemWidth - ITEM_PADDING,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },

  itemImage: {
    width: itemWidth - ITEM_PADDING,
    height: itemWidth - ITEM_PADDING,
  },

  infoText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'IBMPlexMono',
    textAlign: 'center',
    marginBottom: 4,
  },
});
