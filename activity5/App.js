
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

const API_URL =
  'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken';

export default function App() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes when the screen opens
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        setMeals(result.meals || []);
      } catch (error) {
        console.log('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Explorer</Text>
      <Text style={styles.subtitle}>Discover delicious recipes</Text>

      {loading ? (
        <Text style={styles.message}>Loading recipes...</Text>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <View style={styles.recipe}>
              <Text style={styles.recipeName}>{item.strMeal}</Text>
              <Text>{item.strCategory}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
    padding: 20,
    paddingTop: 55,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D94F87',
  },
  subtitle: {
    fontSize: 15,
    color: '#777',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#D94F87',
    marginTop: 20,
  },
  recipe: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
  },
  recipeName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#C44578',
  },
});
