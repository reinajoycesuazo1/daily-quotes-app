import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { getRandomSampleQuote, type Quote } from './quotes-data';

const { width, height } = Dimensions.get('window');

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
        <Text style={styles.loadingText}>✨ Loading inspiration...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ffffff']}
            tintColor="#ffffff"
          />
        }
      >
        <View style={styles.quoteContainer}>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteIcon}>❝</Text>
            <Text style={styles.quoteText}>
              {quote?.q}
            </Text>
            <Text style={styles.authorText}>
              — {quote?.a}
            </Text>
            <Text style={styles.quoteIconBottom}>❞</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={getNewQuote}>
          <Text style={styles.buttonText}>
            {useOfflineMode ? '🎲 Random Quote' : '✨ New Quote'}
          </Text>
        </TouchableOpacity>

        {useOfflineMode && (
          <Text style={styles.offlineIndicator}>📱 Offline Mode</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  quoteContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  quoteCard: {
    backgroundColor: '#ffffff',
    padding: 40,
    borderRadius: 25,
    width: width * 0.9,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quoteIcon: {
    fontSize: 60,
    color: '#667eea',
    textAlign: 'left',
    marginBottom: 10,
    opacity: 0.7,
  },
  quoteText: {
    fontSize: 22,
    fontStyle: 'italic',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 32,
    fontWeight: '500',
  },
  authorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#667eea',
    textAlign: 'right',
    marginBottom: 15,
  },
  quoteIconBottom: {
    fontSize: 60,
    color: '#667eea',
    textAlign: 'right',
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    alignSelf: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  offlineIndicator: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 20,
    fontStyle: 'italic',
  },
});
