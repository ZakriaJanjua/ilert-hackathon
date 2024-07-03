/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { team } from '../store/Team';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuItem } from '@mui/base/MenuItem';
import { Button } from '@mui/material';
import { css } from '@emotion/react';
import { dashboard } from '../store/Dashboard';

function Header() {
	const [openDropdown, setOpenDropdown] = useState(false);

	useEffect(() => {
		getTeams();
	}, []);

	async function getTeams() {
		await team.getTeams();
	}

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position='static'>
				<Toolbar>
					<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
						iLert
					</Typography>
					<IconButton
						size='large'
						edge='start'
						color='inherit'
						aria-label='menu'
						sx={{ mr: 2 }}
						onClick={() => setOpenDropdown((prev) => !prev)}
					>
						<FontAwesomeIcon icon={faUsers} />
						<Typography>{team.selectedTeam.name}</Typography>
					</IconButton>
				</Toolbar>
			</AppBar>
			<Dropdown open={openDropdown}>
				<Menu
					css={css`
						background-color: white;
						width: fit-content;
						padding-right: 1rem;
						border: 1px solid black;
						position: absolute;
						right: 1rem;
						z-index: 2;
					`}
				>
					{team.teams.map((t) => (
						<MenuItem
							css={css`
								list-style: none;
							`}
							key={t.id}
						>
							<Button
								onClick={async () => {
									team.selectTeam(t);
									setOpenDropdown(false);
									await dashboard.putLayout({
										...dashboard.layout,
										currentTeam: t.id,
									});
									// setTimeout(() => {
									// }, 1000);
								}}
							>
								{t.name}
							</Button>
						</MenuItem>
					))}
				</Menu>
			</Dropdown>
		</Box>
	);
}

export default observer(Header);
