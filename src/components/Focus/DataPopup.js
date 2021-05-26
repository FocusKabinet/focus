import React, { useState } from 'react';
import './styles/DataPopup.scss';

function DataPopup({ visible, setVisible }) {
	return (
		<div id='dataVisible' className={visible ? 'show' : 'hide'}>
			<p>Can you spot the item that doesn't belong?</p>
			<ul>
				<li>
					<button
						onClick={() => {
							setVisible(!visible);
						}}
					>
						dd
					</button>
				</li>
				<li>Ipsum</li>
				<li>Dolor</li>
				<li>Sit</li>
				<li>Bumblebees</li>
				<li>Aenean</li>
				<li>Consectetur</li>
			</ul>
		</div>
	);
}

export default DataPopup;
