
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
} from 'react-native';

const API_URL =
  'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken';

export default function App() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  // Fetch recipes when the screen opens
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Unable to connect to the server.');
        }

        const result = await response.json();
        setMeals(result.meals || []);
      } catch (error) {
        setError('Something went wrong. Please check your internet connection.');
        console.log('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

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

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Text style={styles.emoji}>🍓</Text>
        <Text style={styles.title}>Recipe Explorer</Text>
        <Text style={styles.subtitle}>Find something delicious today!</Text>
        <Text style={styles.sectionTitle}>Popular Chicken Recipes</Text>
      </Animated.View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E45B91" />
          <Text style={styles.message}>Preparing your recipes...</Text>
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={styles.list}
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
              />

              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{item.strMeal}</Text>
                <Text style={styles.detail}>
                  Category: {item.strCategory}
                </Text>
                <Text style={styles.detail}>
                  Cuisine: {item.strArea}
                </Text>
              </View>
            </Animated.View>
          )}
          ListEmptyComponent={
            <Text style={styles.message}>No recipes found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
    paddingHorizontal: 18,
    paddingTop: 55,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 5,
  },
  title: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#D94F87',
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B83D73',
    marginTop: 25,
    marginBottom: 15,
  },
  list: {
    paddingBottom: 25,
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
  },
  error: {
    color: '#D64545',
    backgroundColor: '#FFE6E6',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  recipe: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 190,
  },
  recipeInfo: {
    padding: 15,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C44578',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
  },
});
