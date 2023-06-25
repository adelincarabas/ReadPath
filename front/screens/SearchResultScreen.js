import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import axios from "axios";

import DarkBackgroundS from "../components/atoms/DarkBackgroundS";
import IconButton from "../components/atoms/IconButton";
import Header from "../components/atoms/Header";
import BookView from "../components/molecules/BookView";

import { theme } from "../core/theme";

export default function SearchResultScreen({ route, navigation }) {
  const [books, setBooks] = useState([]);
  const [rsltInfo, setRsltInfo] = useState("");
  var key_id = 0;

  useEffect(() => {
    if (route.params.hasOwnProperty("tagName")) {
      // If the user search based on tag, show books with given tag
      setRsltInfo(`Tag: ${route.params.tagName}`);
      fetchBooks(true);
    } else if (route.params.hasOwnProperty("searchText")) {
      // If the user introduced text to search, show books with
      // titles containing that text
      setRsltInfo(`Results for: ${route.params.searchText}`);
      fetchBooks(false);
    }
  }, []);

  const fetchBooks = async (isTag) => {
    if(isTag) {
      try {
        const resp = await axios.get("http://localhost:8080/api/searchTag", { params : {
          tag: route.params.tagName,
        }});
  
        setBooks(resp.data.message);
      } catch (e) {
        console.log(e);
      }
    } else {
        try {
          const resp = await axios.get("http://localhost:8080/api/searchResult", { params : {
            title: route.params.searchText,
          }});
    
          setBooks(resp.data.message);
        } catch (e) {
          console.log(e);
        }
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

  return (
    <DarkBackgroundS>
      {/* Header and title parts */}
      <View style={styles.headerStyle}>
        <IconButton
          icon="arrow-left"
          iconColor={theme.colors.firstColors}
          onPress={() => navigation.goBack()}
          size={30}
        />

        <Header style={styles.titleStyle}> Search Results </Header>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.containerStyle}>
          <Text style={styles.tagStyle} numberOfLines={1}>
            {rsltInfo}
          </Text>
        </View>

        {/* Actual book rendering part */}
        <View style={styles.bookRsltStyle}>
          {books &&
            books.map((item) => (
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
      </ScrollView>
    </DarkBackgroundS>
  );
}

const styles = StyleSheet.create({
  headerStyle: { flex: 0, flexDirection: "row" },
  bookRsltStyle: { padding: 10 },
  titleStyle: {
    fontSize: 22,
    alignSelf: "center",
    textAlign: "right",
    paddingLeft: 30,
    color: "#64CCC5"
  },

  containerStyle: {
    padding: 7,
    backgroundColor: theme.colors.darkBox,
    borderRadius: 15,
    marginBottom: 15,
  },

  tagStyle: {
    alignSelf: "center",
    color: theme.colors.text,
    fontSize: 18,
  },
});
