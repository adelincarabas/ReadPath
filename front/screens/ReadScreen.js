import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import axios from "axios";

// local components import
import DarkBackground from "../components/atoms/DarkBackground";
import Paragraph from "../components/atoms/Paragraph";
import BookView from "../components/molecules/BookView";

import { AuthContext } from "../context/auth";
import { BookContext } from "../context/book";

const HMINUTE_MS = 30000;

export default function ReadScreen({ navigation }) {
  const [books, setBooks] = useContext(BookContext);
  const [state, setState] = useContext(AuthContext);
  const [refreshing, setRefreshing] = React.useState(false);
  var key_id = 0;

  useEffect(() => {
    fetchBooks();

    const interval = setInterval(() => {
      fetchBooks();
    }, HMINUTE_MS);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchBooks();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const fetchBooks = async () => {
    const resp = await axios
      .post("http://localhost:8080/api/my-books", {
        userID: state.user.username,
      })
      .then((res) => {
        setBooks(res.data.message);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const viewBook = (item) => {
    console.log(item);
    navigation.navigate("BookViewScreen", {
      author: item.userID,
      title: item.title,
      views: item.views,
      content: item.text,
    });
  };

  return (
    <DarkBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Paragraph style={styles.ParagraphStyle}> Read Now </Paragraph>

        {/* Actual book rendering part */}
        <View style={styles.bookRsltStyle}>
          {books &&
            books.map((item) => (
              // Add key based on
              <TouchableOpacity key={key_id++} onPress={() => viewBook(item)}>
                <BookView
                  key={key_id++}
                  NbViews={item.views}
                  imgData={item.img.data}
                  bookTitle={item.title}
                  bookTag={item.genre}
                  bookAuthor={item.userID}
                />
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </DarkBackground>
  );
}

const styles = StyleSheet.create({
  bookRsltStyle: { padding: 10 },
  ParagraphStyle: {
    textAlign: "left",
    fontWeight: "bold",
    textAlignVertical: "top",
    fontSize: 19,
    marginTop: 15,
    color: "#64CCC5"
  },
});
