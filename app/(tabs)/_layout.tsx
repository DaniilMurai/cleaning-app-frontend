import {Tabs} from "expo-router";
import {IconSymbol} from "@/components/ui/IconSymbol";

export default function TabsLayout() {

    return (

        <Tabs>
            <Tabs.Screen name="index" options={{
                title: 'Home',
                tabBarIcon: ({color}) =>
                    <IconSymbol size={20} name="house.fill" color={color}/>
            }}/>
            <Tabs.Screen name="tasks" options={{
                title: 'Tasks',
                tabBarIcon: ({color}) =>
                    <IconSymbol size={20} name="task" color={color}/>
            }}/>
            <Tabs.Screen name="profile" options={{
                title: 'Profile',
                tabBarIcon: ({color}) =>
                    <IconSymbol size={20} name="person.fill" color={color}/>
            }}/>
            <Tabs.Screen name="settings" options={{
                title: 'Settings',
                tabBarIcon: ({color}) =>
                    <IconSymbol size={20} name="gearshape.fill" color={color}/>
            }}/>

        </Tabs>
    )
}