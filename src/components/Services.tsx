/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { Container, Divider, List, ListItem, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { team } from '../store/Team';
import { services } from '../store/Services';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCircleCheck,
	faDropletSlash,
	faPlugCircleExclamation,
	faPlugCircleXmark,
	faWrench,
} from '@fortawesome/free-solid-svg-icons';

export const iconMapping: any = {
	OPERATIONAL: (
		<FontAwesomeIcon icon={faCircleCheck} style={{ color: '#63E6BE' }} />
	),
	UNDER_MAINTENANCE: (
		<FontAwesomeIcon icon={faWrench} style={{ color: '#FFD43B' }} />
	),
	DEGRADED: (
		<FontAwesomeIcon icon={faDropletSlash} style={{ color: '#ce8912' }} />
	),
	PARTIAL_OUTAGE: (
		<FontAwesomeIcon
			icon={faPlugCircleExclamation}
			style={{ color: '#ea8357' }}
		/>
	),
	MAJOR_OUTAGE: (
		<FontAwesomeIcon icon={faPlugCircleXmark} style={{ color: '#e10e0e' }} />
	),
};

function Services() {
	useEffect(() => {
		getServices();
	}, [team.selectedTeam.id]);

	async function getServices() {
		await services.getServices();
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
			<Typography variant='h5' sx={{ marginBottom: '1rem', marginTop: '3rem' }}>
				Service status
			</Typography>
			<List
				css={css`
					max-width: 50%;
				`}
			>
				{services.services.map((service) => (
					<div key={service.id}>
						<Divider />
						<ListItem
							css={css`
								display: flex;
								align-items: center;
								column-gap: 1rem;
							`}
						>
							{iconMapping[service.status]}
							{service.name}
						</ListItem>
					</div>
				))}
				<Divider />
			</List>
		</Container>
	);
}

export default observer(Services);
