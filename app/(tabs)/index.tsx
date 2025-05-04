import {Pressable, StyleSheet, Text, View} from "react-native";
import {Colors} from "@/constants/Colors";
import {stylesheet} from "@/src/styles/unistyles";

export default function Index() {


    return (
        <View style={styles.container}>
            <Text style={{color: Colors.light.text}}>Привет, Это страница Home</Text>
            <Pressable style={stylesheet.button}><Text style={stylesheet.text}>asdasd</Text></Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

    }
})