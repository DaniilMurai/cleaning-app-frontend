import {StyleSheet, Text, View} from "react-native";
import {Colors} from "@/constants/Colors";


export default function TasksPage() {


    return (

        <View style={styles.container}>
            <Text style={{color: Colors.light.text}}>Это страница Tasks</Text>
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