import { View } from "react-native";
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
		direction: "desc",
	});

	const [isVisibleFilterPanel, setIsVisibleFilterPanel] = useState(true);

	const { data: reports, isLoading, refetch } = useGetReports(queryParams);

	// Обновляем параметры запроса
	const handleSearch = (newParams: Partial<GetReportsParams>) => {
		setQueryParams(prev => ({
			...prev,
			...newParams,
		}));
	};

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				{!isVisibleFilterPanel && (
					<Button
						variant={"outlined"}
						onPress={() => setIsVisibleFilterPanel(!isVisibleFilterPanel)}
						style={{ marginStart: "auto" }}
					>
						Show Filter Panel
					</Button>
				)}
				<SearchFilterPanel
					isVisible={isVisibleFilterPanel}
					params={queryParams}
					onAction={handleSearch}
					onChangeVisible={isVisible => setIsVisibleFilterPanel(isVisible)}
				/>
			</View>
			<View style={styles.scrollContainer}>
				{reports ? (
					<ReportsTable
						reports={reports}
						users={users}
						assignments={assignments}
						locations={locations}
					/>
				) : (
					<Typography>No Reports Found</Typography>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		flexDirection: "column",
		paddingHorizontal: {
			xs: theme.spacing(2),
			lg: theme.spacing(4),
			xl: theme.spacing(5),
			superLarge: theme.spacing(12),
		},
		paddingVertical: theme.spacing(4),
	},
	scrollContainer: {
		flex: 1,
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
