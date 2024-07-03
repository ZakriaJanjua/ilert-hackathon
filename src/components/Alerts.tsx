import { Box, Container, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { alerts } from '../store/Alerts';
import { team } from '../store/Team';

function Alerts() {
	useEffect(() => {
		getAlerts();
	}, [team.selectedTeam.id]);

	async function getAlerts() {
		await alerts.getAcceptedAlerts();
		await alerts.getPendingAlerts();
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
			<Typography variant='h5'>Open alerts</Typography>
			<Box
				component='section'
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					columnGap: '2rem',
				}}
			>
				<Box
					component='div'
					sx={{
						border: '1px solid black',
						borderRadius: '5px',
						padding: '2rem',
						width: '10rem',
					}}
				>
					<Typography textAlign='center'>Pending Alerts</Typography>
					<Typography variant='h4' color='primary' textAlign='center'>
						{alerts.pending}
					</Typography>
				</Box>
				<Box
					component='div'
					sx={{
						border: '1px solid black',
						borderRadius: '5px',
						padding: '2rem',
						width: '10rem',
					}}
				>
					<Typography textAlign='center'>Accepted Alerts</Typography>
					<Typography variant='h4' color='primary' textAlign='center'>
						{alerts.accepted}
					</Typography>
				</Box>
			</Box>
		</Container>
	);
}

export default observer(Alerts);
