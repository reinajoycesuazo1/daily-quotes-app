import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import { getRandomSampleQuote, type Quote } from './quotes-data';

export default function QuotesApp() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [useOfflineMode, setUseOfflineMode] = useState(false);

  const fetchQuote = async () => {
    try {
      const response = await fetch('https://zenquotes.io/api/random');
      const quotes: Quote[] = await response.json();

      if (quotes && quotes.length > 0) {
        setQuote(quotes[0]);
        setUseOfflineMode(false);
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Fallback to offline quotes when API fails
      const offlineQuote = getRandomSampleQuote();
      setQuote(offlineQuote);
      setUseOfflineMode(true);
      Alert.alert('Offline Mode', 'Using offline quotes due to network issues.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getNewQuote = () => {
    if (useOfflineMode) {
      // Always use offline quotes when in offline mode
      setQuote(getRandomSampleQuote());
    } else {
      // Try to fetch from API, fallback to offline if it fails
      fetchQuote();
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchQuote();
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading quote...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>
          "{quote?.q}"
        </Text>
        <Text style={styles.authorText}>
          — {quote?.a}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={fetchQuote}>
        <Text style={styles.buttonText}>New Quote</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  quoteContainer: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quoteText: {
    fontSize: 24,
    fontStyle: 'italic',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 32,
  },
  authorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
