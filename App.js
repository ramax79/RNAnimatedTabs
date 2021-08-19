import { StatusBar } from 'expo-status-bar'
import React from 'react'
import {
  findNodeHandle,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native'

const { width, height } = Dimensions.get('screen')

const images = {
  man:
    'https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  women:
    'https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  kids:
    'https://images.pexels.com/photos/5080167/pexels-photo-5080167.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  skullcandy:
    'https://images.pexels.com/photos/5602879/pexels-photo-5602879.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  help:
    'https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
}
const data = Object.keys(images).map((i) => ({
  key: i,
  title: i,
  image: images[i],
  ref: React.createRef(),
}))

const Tab = React.forwardRef(({ item, onItemPress }, ref) => {
  return (
    <TouchableOpacity onPress={onItemPress}>
      <View ref={ref}>
        <Text
          style={{
            color: 'white',
            fontSize: 84 / data.length,
            fontWeight: '800',
            textTransform: 'uppercase',
          }}
        >
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  )
})

const Indicator = ({ measures, scrollX }) => {
  const inputRange = data.map((_, i) => i * width)
  const IndicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((measures) => measures.width),
  })
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((measures) => measures.x),
  })

  return (
    <Animated.View
      style={{
        position: 'absolute',
        height: 4,
        width: IndicatorWidth,
        left: 0,
        backgroundColor: 'white',
        bottom: -10,
        transform: [
          {
            translateX,
          },
        ],
      }}
    />
  )
}

const Tabs = ({ data, scrollX, onItemPress }) => {
  const [measures, setMeasures] = React.useState([])
  const containerRef = React.useRef()
  React.useEffect(() => {
    let m = []
    data.forEach((item) => {
      item.ref.current.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          // console.log(x, y, width)
          m.push({
            x,
            y,
            width,
            height,
          })
          if (m.length === data.length) {
            setMeasures(m)
          }
        }
      )
    })
  }, [])
  return (
    <View style={{ position: 'absolute', top: 100, width }}>
      <View
        ref={containerRef}
        style={{
          justifyContent: 'space-evenly',
          flex: 1,
          flexDirection: 'row',
        }}
      >
        {data.map((item, index) => {
          return (
            <Tab
              key={item.key}
              item={item}
              ref={item.ref}
              onItemPress={() => onItemPress(index)}
            />
          )
        })}
      </View>
      {measures.length > 0 && (
        <Indicator measures={measures} scrollX={scrollX} />
      )}
    </View>
  )
}

export default function App() {
  const scrollX = React.useRef(new Animated.Value(0)).current // мы используем React.useRef потомучто React  сохранит эту ссылку, всякий раз когда компонент будет перерисован или получит новый реквизит это анимированное значение не будет изменено. С этим scrollX мы можем получить событие при прокрутке которое является анимированным событием и здесь мы получим из собственного события смешение содержимого получи х и назначит его прокрутке х и что важно в этом конкретном руководстве не будет использоваться родной драйвер в основном потоке, что индикатор или вкладки индикатор собирается изменить свою ширину и использовать собственный драйвер, он только работает для преобразований и непрозрачности, поэтому для ширины это к сожалению не так работает и с учетом этого ничего не должно изменить прокрутку х теперь он действительно изменен
  // на основе позиции прокрутки и вместе с плоским списком создадим здесь несколько вкладок передать ноги прокрутки и данные, которые являются данными а для вкладок создайте вкладки компонентов или вкладки конусов он равен методу получения данных и прокрутки ног, и он будет возращать представление и внутри него у нас будет другое представление для вкладок, и здесь мы итерация по элементу карты данных вернется сюда. tab передает ключ как ключ элемента и передает элемент как элемент
  // и вкладка создайте его сдесь чтобы вкладка получила элемент, и это собираюсь вернуть взгляд и текст внутри с названием элементов все впорядке, так что это видно здесь и давайте разместим весь вид
  const ref = React.useRef()
  const onItemPress = React.useCallback((itemIndex) => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * width,
    })
  })
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.FlatList
        ref={ref}
        data={data}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image
                source={{ uri: item.image }}
                style={{ flex: 1, resizeMode: 'cover' }}
              />
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { backgroundColor: 'rgba(0,0,0,0.3)' },
                ]}
              />
            </View>
          )
        }}
      />
      <Tabs scrollX={scrollX} data={data} onItemPress={onItemPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
