
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
} from 'react-native';

const API_URL =
  'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken';

export default function App() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

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
      setError('Unable to load recipes. Please check your internet connection.');
      console.log('Fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load recipes automatically when the screen opens
  useEffect(() => {
    fetchMeals();
  }, []);

  // Animate the screen after the initial loading
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

  // Refresh the recipe list
  const handleRefresh = () => {
    setRefreshing(true);
    fetchMeals(true);
  };

  return (
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
          <View>
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
          >
            <Text style={styles.refreshText}>↻</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Made with love</Text>
          <Text style={styles.bannerText}>
            Explore tasty chicken recipes from around the world.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Popular Recipes</Text>
        <Text style={styles.recipeCount}>
          {meals.length} recipes available
        </Text>
      </Animated.View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E45B91" />
          <Text style={styles.message}>Preparing your recipes...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>🥺</Text>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchMeals()}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
                <Text style={styles.recipeName}>{item.strMeal}</Text>

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

      <Text style={styles.footer}>Made for food lovers ♡</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
    paddingHorizontal: 18,
    paddingTop: 50,
  },
  header: {
    marginBottom: 15,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 30,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D94F87',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  refreshButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#F9DCE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshText: {
    fontSize: 30,
    color: '#C44578',
    lineHeight: 34,
  },
  banner: {
    backgroundColor: '#F9DCE8',
    padding: 16,
    borderRadius: 17,
    marginTop: 20,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#B83D73',
  },
  bannerText: {
    fontSize: 13,
    color: '#8F5570',
    marginTop: 5,
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#B83D73',
    marginTop: 22,
  },
  recipeCount: {
    color: '#999',
    fontSize: 12,
    marginTop: 3,
  },
  list: {
    paddingBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: '#D94F87',
    marginTop: 12,
    fontSize: 15,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  errorEmoji: {
    fontSize: 40,
  },
  error: {
    color: '#D64545',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#E45B91',
    paddingHorizontal: 25,
    paddingVertical: 12,
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
    marginTop: 15,
    marginBottom: 3,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#D98AA8',
    shadowOpacity: 0.12,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: '100%',
    height: 185,
  },
  recipeInfo: {
    padding: 15,
  },
  recipeName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#C44578',
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detail: {
    fontSize: 13,
    color: '#777',
  },
  recipeId: {
    fontSize: 11,
    color: '#AAAAAA',
    marginTop: 10,
  },
  footer: {
    textAlign: 'center',
    color: '#C98AA5',
    fontSize: 12,
    paddingVertical: 10,
  },
});
