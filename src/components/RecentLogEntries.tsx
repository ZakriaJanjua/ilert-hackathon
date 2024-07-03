import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { recentLogEntries } from '../store/RecentLogEntries';
import moment from 'moment';
import { Container, Typography } from '@mui/material';
import { team } from '../store/Team';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

export function getFormattedDuration(startDate: Date) {
	const now = moment();
	const start = moment(startDate);

	const duration = moment.duration(now.diff(start));

	const days = Math.floor(duration.asDays());
	const hours = Math.floor(duration.asHours() % 24);
	const minutes = Math.floor(duration.asMinutes() % 60);

	let formattedDuration;
	if (days > 0) {
		formattedDuration = `${days}d ${hours}h`;
	} else if (hours > 0) {
		formattedDuration = `${hours}h ${minutes}m`;
	} else {
		formattedDuration = `${minutes}m`;
	}

	return formattedDuration;
}

function RecentLogEntries() {
	useEffect(() => {
		getLogEntries();
	}, [team.selectedTeam.id]);

	async function getLogEntries() {
		await recentLogEntries.getRecentLogEntries();
	}
	return (
		<Container
			sx={{
				marginTop: '1rem',
				borderRadius: '3px',
				padding: '1rem',
				height: '20rem',
			}}
		>
			<Typography variant='h5' sx={{ marginBottom: '1rem' }}>
				Recent alert activity
			</Typography>
			<TableContainer component={Paper} sx={{ maxHeight: 250 }}>
				<Table
					stickyHeader
					sx={{ minWidth: 700 }}
					aria-label='customized table'
				>
					<TableHead>
						<TableRow>
							<StyledTableCell>Alert Source</StyledTableCell>
							<StyledTableCell>Alert</StyledTableCell>
							<StyledTableCell>Time</StyledTableCell>
							<StyledTableCell>Activity</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{recentLogEntries.entries.map((entry) => (
							<StyledTableRow key={entry.id}>
								<StyledTableCell>
									{entry.alert.alertSource.name}
								</StyledTableCell>
								<StyledTableCell>{entry.alert.summary}</StyledTableCell>
								<StyledTableCell>
									{getFormattedDuration(entry.timestamp)}
								</StyledTableCell>
								<StyledTableCell>{entry.text}</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
}

export default observer(RecentLogEntries);
