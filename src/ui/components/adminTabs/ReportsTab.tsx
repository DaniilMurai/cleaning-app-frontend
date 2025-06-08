import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button, Typography } from "@/ui";
import {
	AdminReadUser,
	DailyAssignmentResponse,
	GetReportsParams,
	LocationResponse,
	useGetReports,
} from "@/api/admin";
import ReportsTable from "@/ui/components/reports/ReportTable";
import { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import SearchFilterPanel from "@/ui/components/reports/SearchFilterPanel";

interface Props {
	users: AdminReadUser[];
	assignments: DailyAssignmentResponse[];
	locations: LocationResponse[];
}

export default function ReportsTab({ users, assignments, locations }: Props) {
	// Состояние для параметров запроса
	const [queryParams, setQueryParams] = useState<GetReportsParams>({
		order_by: "id",
		offset: 0,
		limit: 100,
		direction: "desc",
	});

	// ✅ Правильное использование хука с параметрами
	const { data: reports, isLoading, refetch } = useGetReports(queryParams);
	const [density, setDensity] = useState<boolean>(false); //TODO

	// Обновляем параметры запроса
	const handleSearch = (newParams: Partial<GetReportsParams>) => {
		setQueryParams(prev => ({
			...prev,
			...newParams,
			offset: 0, // Сброс пагинации при новых фильтрах
		}));
	};

	return (
		<View style={styles.container}>
			<ScrollView style={styles.scrollContainer}>
				<View style={styles.headerContainer}>
					<SearchFilterPanel params={queryParams} onAction={handleSearch} />
				</View>
				<View style={styles.buttonContainer}>
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
		alignItems: "center",
		marginBottom: theme.spacing(2),
		zIndex: 10,
	},
	buttonContainer: {
		flexDirection: "row-reverse",
		marginBottom: theme.spacing(1),
	},
}));
