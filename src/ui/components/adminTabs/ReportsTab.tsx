import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button, Typography } from "@/ui";
import {
	AdminReadUser,
	DailyAssignmentResponse,
	LocationResponse,
	useGetReports,
} from "@/api/admin";
import ReportsTable from "@/ui/components/reports/ReportTable";
import { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";

interface Props {
	users: AdminReadUser[];
	assignments: DailyAssignmentResponse[];
	locations: LocationResponse[];
}

export default function ReportsTab({ users, assignments, locations }: Props) {
	const { data: reports, isLoading, refetch } = useGetReports();
	const [density, setDensity] = useState<boolean>(false);

	return (
		<View style={styles.container}>
			<ScrollView style={styles.scrollContainer}>
				<View style={styles.headerContainer}>
					<Button variant={"outlined"} onPress={() => setDensity(!density)}>
						{density ? (
							<FontAwesome5 name="expand" size={20} />
						) : (
							<FontAwesome5 name="compress" size={20} />
						)}
					</Button>
				</View>
				{reports ? (
					<ReportsTable
						reports={reports}
						density={density ? "dense" : "normal"}
						users={users}
						assignments={assignments}
						locations={locations}
					/>
				) : (
					<Typography>No Reports Found</Typography>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
	},
	scrollContainer: {
		flex: 1,
		padding: theme.spacing(2),
	},
	headerContainer: {
		flexDirection: "row",
		marginBottom: theme.spacing(2),
	},
}));
