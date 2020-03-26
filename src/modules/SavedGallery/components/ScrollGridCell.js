// @flow
import React from 'react';
import { FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

const COLUMN_NUM = 3;
const COLUMN_MIN_W = 105;

type Props = {
  style: ?Object,
  filesInfo: Array<FileInfo>,
  onImagePress: (name: string) => void,
};

type State = {
  itemWidth: number,
  layoutDone: boolean,
};

export default class ScrollGridCell extends React.Component<Props, State> {
  static defaultProps = {
    style: null,
  };

  state = {
    itemWidth: COLUMN_MIN_W,
    layoutDone: false,
  };

  shouldComponentUpdate(newProps: Props, newState: State) {
    return newProps.filesInfo !== this.props.filesInfo
      || newState.itemWidth !== this.state.itemWidth;
  }

  onImagePress(selectedName: string) {
    const { onImagePress } = this.props;
    if (onImagePress) {
      onImagePress(selectedName);
    }
  }

  onListLayout = ({ nativeEvent }: OnLayoutEvent) => {
    this.setState({
      itemWidth: Math.floor(nativeEvent.layout.width / COLUMN_NUM),
      layoutDone: true,
    });
  }

  // eslint-disable-next-line react/no-unused-prop-types
  renderItem = ({ item }: { item: FileInfo }) => {
    const { itemWidth, layoutDone } = this.state;
    const imageWidth = itemWidth * 0.75;

    return (
      <TouchableOpacity
        style={[
            styles.itemCont,
            {
              width: itemWidth,
              height: itemWidth,
              borderRadius: itemWidth / 2,
            },
          ]}
        activeOpacity={1}
        onPress={() => this.onImagePress(item.name)}
      >
        {layoutDone && (
          <Image
            style={{
              width: imageWidth,
              height: imageWidth,
              borderRadius: imageWidth / 2,
            }}
            source={{ uri: `file://${item.name}` }}
          />
        )}
      </TouchableOpacity>
    );
  }

  render() {
    const { filesInfo, style } = this.props;

    return (
      <FlatList
        style={[styles.container, style]}
        data={filesInfo}
        extraData={this.state.itemWidth}
        keyExtractor={item => `${item.name}${Math.random() * 1000000}`}
        renderItem={this.renderItem}
        numColumns={COLUMN_NUM}
        onLayout={this.onListLayout}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 4,
    marginBottom: 16,
  },

  itemCont: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
