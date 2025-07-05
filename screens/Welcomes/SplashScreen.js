import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
  useAnimatedProps,
  withSequence,
  runOnJS,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'

const { width, height } = Dimensions.get('window')

export default function SplashScreen() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const opacity = useSharedValue(1)
  const logoBounce = useSharedValue(0)
  const floatDot = useSharedValue(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 15
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => setLoading(false), 500)
          return 100
        }
        return next
      })
    }, 200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    logoBounce.value = withRepeat(withSequence(
      withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
    ), -1, true)

    floatDot.value = withRepeat(withSequence(
      withTiming(10, { duration: 1000 }),
      withTiming(0, { duration: 1000 })
    ), -1)
  }, [])

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoBounce.value }],
  }))

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: floatDot.value }],
    opacity: interpolate(floatDot.value, [0, 10], [1, 0.5]),
  }))

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress}%`,
  }))

  if (!loading) {
    return (
      <Animated.View style={[StyleSheet.absoluteFill, styles.fadeOut]}>
        <Animated.View style={styles.centered}>
          <Text style={styles.welcomeText}>Welcome to QuickAuct!</Text>
        </Animated.View>
      </Animated.View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['white', '#f0fdf4', '#dcfce7']}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating Animated Circles */}
      {[...Array(6)].map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.floatingDot,
            {
              top: `${30 + (i % 2) * 30}%`,
              left: `${20 + i * 10}%`,
              animationDelay: i * 300,
            },
          ]}
        />
      ))}

      {/* Main Logo Area */}
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={styles.logoGlow} />
          <Image
            source={require('../../assets/icons/shield.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Animated App Name */}
        <Text style={styles.appName}>QuickAuct</Text>
        <Text style={styles.subtitle}>Lightning Fast Auctions</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, progressStyle]} />
          </View>
          <Animated.View style={[styles.dot, dotStyle]} />
        </View>

        {/* Loading Text */}
        <Text style={styles.loadingText}>Loading amazing auctions...</Text>
      </View>

      {/* Bottom Tagline */}
      <View style={styles.bottom}>
        <Text style={styles.bottomText}>Powered by lightning-fast technology</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fadeOut: {
    backgroundColor: 'white',
    zIndex: 50,
    opacity: 0,
    transition: 'opacity 0.5s',
  },
  welcomeText: {
    fontSize: 24,
    color: '#00A651',
    fontWeight: 'bold',
  },
  content: {
    zIndex: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: 32,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    zIndex: 2,
  },
  logoGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 166, 81, 0.2)',
    borderRadius: 24,
    zIndex: 1,
    shadowColor: '#00A651',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00A651',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 32,
  },
  progressContainer: {
    width: width * 0.7,
    marginBottom: 12,
    position: 'relative',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00A651',
    borderRadius: 9999,
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: '#00A651',
    borderRadius: 6,
    position: 'absolute',
    top: -5,
    right: 0,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  floatingDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: 'rgba(0, 166, 81, 0.3)',
    borderRadius: 4,
  },
  bottom: {
    position: 'absolute',
    bottom: 30,
  },
  bottomText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
})


