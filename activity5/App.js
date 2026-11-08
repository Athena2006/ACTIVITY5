
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Platform,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

const API_URL =
  'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken';

export default function App() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Fetch recipe data from TheMealDB
  const fetchMeals = async (isRefresh = false) => {
    if (!isRefresh) {
      setLoading(true);
    }

    setError('');

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Unable to connect to the server.');
      }

      const result = await response.json();
      setMeals(result.meals || []);
    } catch (error) {
      setError('Unable to load recipes. Check your internet connection.');
      console.log('Fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load recipes when the screen opens
  useEffect(() => {
    fetchMeals();
  }, []);

  // Animate the screen after loading
  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, fadeAnim, slideAnim]);

  // Refresh recipe list
  const handleRefresh = () => {
    setRefreshing(true);
    fetchMeals(true);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar
          backgroundColor="#FFF5F8"
          barStyle="dark-content"
        />

        <View style={styles.container}>
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.headerTop}>
              <View style={styles.headerText}>
                <Text style={styles.emoji}>🍓</Text>
                <Text style={styles.title}>Recipe Explorer</Text>
                <Text style={styles.subtitle}>
                  Find something delicious today!
                </Text>
              </View>

              <TouchableOpacity
                style={styles.refreshButton}
                onPress={handleRefresh}
                disabled={loading || refreshing}
                activeOpacity={0.7}
              >
                <Text style={styles.refreshText}>↻</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.banner}>
              <Text style={styles.bannerTitle}>Made with Athena Jean Daguman ♡</Text>
              <Text style={styles.bannerText}>
                Explore tasty chicken recipes from around the world.
              </Text>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Recipes</Text>
              <Text style={styles.recipeCount}>
                {meals.length} recipes
              </Text>
            </View>
          </Animated.View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#E45B91" />
              <Text style={styles.message}>
                Preparing your recipes...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorEmoji}>🥺</Text>
              <Text style={styles.error}>{error}</Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => fetchMeals()}
                activeOpacity={0.7}
              >
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              style={styles.recipeList}
              data={meals}
              keyExtractor={(item) => item.idMeal}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="#E45B91"
                  colors={['#E45B91']}
                />
              }
              renderItem={({ item }) => (
                <Animated.View
                  style={[
                    styles.recipe,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }],
                    },
                  ]}
                >
                  <Image
                    source={{ uri: item.strMealThumb }}
                    style={styles.image}
                    resizeMode="cover"
                  />

                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeName}>
                      {item.strMeal}
                    </Text>

                    <View style={styles.detailsRow}>
                      <Text style={styles.detail}>
                        🍽 {item.strCategory || 'Recipe'}
                      </Text>

                      <Text style={styles.detail}>
                        🌎 {item.strArea || 'International'}
                      </Text>
                    </View>

                    <Text style={styles.recipeId}>
                      Recipe ID: {item.idMeal}
                    </Text>
                  </View>
                </Animated.View>
              )}
              ListEmptyComponent={
                <Text style={styles.message}>No recipes found.</Text>
              }
            />
          )}

          <Text style={styles.footer}>
            Made for food lovers ♡
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  header: {
    flexShrink: 0,
    marginBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  emoji: {
    fontSize: 27,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#D94F87',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 3,
  },
  refreshButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#F9DCE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  refreshText: {
    fontSize: 30,
    color: '#C44578',
    lineHeight: 35,
  },
  banner: {
    backgroundColor: '#F9DCE8',
    padding: 13,
    borderRadius: 16,
    marginTop: 15,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B83D73',
  },
  bannerText: {
    fontSize: 12,
    color: '#8F5570',
    marginTop: 4,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 17,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B83D73',
  },
  recipeCount: {
    fontSize: 12,
    color: '#999',
  },
  recipeList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 18,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: '#D94F87',
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  errorEmoji: {
    fontSize: 38,
  },
  error: {
    color: '#D64545',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#E45B91',
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 18,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  recipe: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginTop: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#D98AA8',
    shadowOpacity: 0.12,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: '100%',
    height: 175,
  },
  recipeInfo: {
    padding: 14,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C44578',
    marginBottom: 9,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detail: {
    fontSize: 12,
    color: '#777',
  },
  recipeId: {
    fontSize: 10,
    color: '#AAAAAA',
    marginTop: 9,
  },
  footer: {
    textAlign: 'center',
    color: '#C98AA5',
    fontSize: 11,
    paddingTop: 7,
    paddingBottom: Platform.OS === 'android' ? 4 : 2,
  },
});
