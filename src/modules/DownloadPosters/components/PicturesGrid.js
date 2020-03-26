// @flow
import React from 'react';
import { View, Image, StyleSheet, FlatList } from 'react-native';

import { colors } from '../../../common/ui';

const COLUMNS_COUNT = 5;
const ROWS_COUNT = 6;

type Props = {
  style: ?Object,
  filesInfo: Array<FileInfo>,
};

type State = {
  itemWidth: number,
  itemHeight: number,
};

export default class PicturesGrid extends React.Component<Props, State> {
  state = {
    itemWidth: 0,
    itemHeight: 0,
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.state.itemWidth !== nextState.itemWidth;
  }

  onListLayout = ({ nativeEvent }: OnLayoutEvent) => {
    this.setState({
      itemWidth: Math.floor(nativeEvent.layout.width / COLUMNS_COUNT),
      itemHeight: Math.floor(nativeEvent.layout.height / ROWS_COUNT),
    });
  }

  // eslint-disable-next-line react/no-unused-prop-types
  renderItem = ({ item }: { item: FileInfo }) => {
    const { itemWidth, itemHeight } = this.state;
    const imageWidth = itemWidth * 0.75;

    return (
      <View
        style={[
          styles.itemCont,
          { width: itemWidth, height: itemHeight },
        ]}
      >
        {itemWidth > 0 && (
          <Image
            style={{
              width: imageWidth,
              height: imageWidth,
              borderRadius: imageWidth / 2,
            }}
            source={{ uri: `file://${item.name}` }}
          />
        )}
      </View>
    );
  }

  render() {
    const { filesInfo, style } = this.props;

    return (
      <View style={[styles.container, style]}>
        <FlatList
          data={filesInfo}
          extraData={this.state.itemWidth}
          onLayout={this.onListLayout}
          renderItem={this.renderItem}
          numColumns={COLUMNS_COUNT}
          scrollEnabled={false}
          keyExtractor={i => `${i.name}${Math.random() * 1000000}`}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    padding: 24,
  },

  itemCont: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
