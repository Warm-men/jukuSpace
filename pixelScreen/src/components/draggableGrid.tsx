import React, { useRef } from 'react';
import { View, FlatList, Image, PanResponder, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Res from '@res';

const DragAndSort = () => {
  const data = [
    { id: '1', width: 100, height: 100, uri: Res.A }, // 100x100 图片数据
    { id: '2', width: 200, height: 100, uri: Res.B }, // 200x100 图片数据
    { id: '3', width: 100, height: 200, uri: Res.C }, // 100x200 图片数据
    { id: '4', width: 200, height: 200, uri: Res.D }, // 200x200 图片数据
    { id: '5', width: 100, height: 100, uri: Res.E }, // 100x100 图片数据
    { id: '6', width: 200, height: 100, uri: Res.F }, // 200x100 图片数据
    // 添加更多图片数据
  ];

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        // 松手时的操作，可以在此处实现排序逻辑
        // 根据 pan.x 和 pan.y 的值，判断拖拽的位置和方向，进行排序处理
        pan.setValue({ x: 0, y: 0 }); // 重置 pan 值
      },
    })
  ).current;

  const renderItem = ({ item }) => {
    const imageStyle = {
      width: item.width,
      height: item.height,
      transform: [{ translateX: pan.x }, { translateY: pan.y }],
    };

    return (
      <TouchableOpacity key={item.id} {...panResponder.panHandlers}>
        <Animated.View>
          <Image source={{ uri: item.uri }} style={imageStyle} resizeMode="stretch" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal={true} // 水平滚动
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default DragAndSort;
