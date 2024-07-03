/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { Box, Container, List, ListItem, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { incidents } from '../store/Incidents';
import { css } from '@emotion/react';
import { iconMapping } from './Services';
import { getFormattedDuration } from './RecentLogEntries';
import { team } from '../store/Team';

function Incidents() {
	const [res, setRes] = useState<any[]>([]);
	useEffect(() => {
		getIncidents();
	}, [team.selectedTeam.id]);

	async function getIncidents() {
		await incidents.getIncidents();
		if (team.selectedTeam.id === 0 || team.selectedTeam.id === -1) {
			setRes(incidents.incidents);
		} else {
			const result = incidents.incidents.filter((obj) => {
				return (
					Array.isArray(obj.affectedServices) &&
					obj.affectedServices.some((service: any) =>
						service.service.teams.some(
							(team1: any) => team1.id === team.selectedTeam.id
						)
					)
				);
			});
			setRes(result);
		}
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
				Open incidents
			</Typography>
			{res.map((incident) => {
				if (incident)
					return (
						<div
							css={css`
								margin-bottom: 0.5rem;
							`}
							key={incident.id}
						>
							<SingleIncident incident={incident} key={incident.id} />
						</div>
					);
			})}
		</Container>
	);
}

function SingleIncident({ incident }: { incident: any }) {
	return (
		<Box
			css={css`
				border: 1px solid black;
				border-radius: 4px;
			`}
		>
			<Container>
				<div
					css={css`
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 0.5rem;
						margin-bottom: 0.5rem;
					`}
				>
					<Typography variant='h6' color='primary'>
						{incident.summary}
					</Typography>

					<Typography
						css={css`
							background-color: blue;
							color: white;
							padding-left: 0.5rem;
							padding-right: 0.5rem;
							border-radius: 4px;
						`}
						variant='overline'
					>
						{incident.status}
					</Typography>
				</div>
				<Typography variant='body2'>
					{getFormattedDuration(incident.createdAt)} ago - {incident.message}
				</Typography>
				<List
					css={css`
						display: flex;
						column-gap: 1.5rem;
					`}
				>
					{incident.affectedServices.map((service: any) => (
						<ListItem
							css={css`
								display: flex;
								align-items: center;
								column-gap: 0.5rem;
							`}
							key={service.id}
						>
							{iconMapping[service.service.status]}
							{service.service.name}
						</ListItem>
					))}
				</List>
			</Container>
		</Box>
	);
}

export default observer(Incidents);
