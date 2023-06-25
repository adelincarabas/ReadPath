import React, { useContext, useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import axios from "axios";

// Local atom imports
import DarkBackgroundS from "../components/atoms/DarkBackgroundS";
import BookViewV from "../components/molecules/BookViewV";
import BookView from "../components/molecules/BookView";
import Paragraph from "../components/atoms/Paragraph";

import { theme } from "../core/theme";

const HOURS_MS = 4 * 60 * 60000;

export default function HomeScreen({ navigation }) {
  const [savedBooks, setSavedBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  let key_id = 0;

  // Show popular stories and recently added stories
  useEffect(() => {
    fetchPopularBooks();
    fetchRecentBooks();

    const interval = setInterval(() => {
      fetchPopularBooks();
      fetchRecentBooks();
    }, HOURS_MS);

    return () => clearInterval(interval);
  }, []);

  const fetchPopularBooks = async () => {
    // to get the parameters passed in the SearchScreen -> route.params
    // var query = {id: id};

    try {
      const bookData = await axios.get(
        "http://localhost:8080/api/popularBooks"
      );

      setSavedBooks(bookData.data.message);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchRecentBooks = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/last2Books");
      
      setRecentBooks(res.data.message);
    } catch(e) {
      console.log(e);
    }
  };

  const viewBook = (item) => {
    navigation.navigate("BookViewScreen", {
      author: item.username,
      title: item.title,
      views: item.views,
      content: item.content,
      tag: item.tag,
      contentParts: item.contentParts
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPopularBooks();
    fetchRecentBooks();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <DarkBackgroundS>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flex: 4 }}>
          <Paragraph style={styles.ParagraphStyle}> Popular Now </Paragraph>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {savedBooks &&
              savedBooks.map((item) => (
                // Add key based on
                <TouchableOpacity key={key_id++} onPress={() => viewBook(item)}>
                  <BookViewV
                    key={key_id++}
                    NbViews={item.views}
                    imgData={item.image.data}
                    bookTitle={item.title}
                    bookTag={item.genre}
                    bookAuthor={item.username}
                  />
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>

        <View style={{ flex: 6 }}>
          <Paragraph style={styles.ParagraphStyle}> Recently Added </Paragraph>

          <View style={styles.scrollContainer}>
            {recentBooks &&
              recentBooks.map((item) => (
                // Add key based on
                <TouchableOpacity key={key_id++} onPress={() => viewBook(item)}>
                  <BookView
                    key={key_id++}
                    NbViews={item.views}
                    imgData={item.image.data}
                    bookTitle={item.title}
                    bookTag={item.tag}
                    bookAuthor={item.username}
                  />
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </ScrollView>
    </DarkBackgroundS>
  );
}

const styles = StyleSheet.create({
  ParagraphStyle: {
    textAlign: "left",
    fontWeight: "bold",
    textAlignVertical: "top",
    fontSize: 19,
    color: '#64CCC5',
    paddingTop: 20
  },

  scrollContainer: { borderRadius: 15, padding: 10 },
  bookStyleH: { paddingRight: 35 },
  bookInfoH: { padding: 5, paddingBottom: 0 },
  infoH: { color: theme.colors.text },
  horizontalScroll: { flex: 5, flexDirection: "row", padding: 3 },
});
