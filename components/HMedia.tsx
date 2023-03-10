import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';
import styled from 'styled-components/native';
import { Movie } from '../api';
import Poster from './Poster';
import Votes from './Votes';

interface HMediaProps {
	posterPath: string;
	originalTitle: string;
	overview: string;
	releaseDate?: string;
	voteAverage?: number;
	fullData: Movie;
}

const HMedia: React.FC<HMediaProps> = ({
	posterPath,
	originalTitle,
	overview,
	releaseDate,
	voteAverage,
	fullData,
}) => {
	const isDark = useColorScheme() === 'dark';
	const { navigate } = useNavigation();
	const goToDetail = () =>
		navigate('Stacks', { screen: 'Detail', params: { ...fullData } });

	return (
		<TouchableOpacity onPress={goToDetail}>
			<HMovie>
				<Poster path={posterPath} />
				<HColumn>
					<Title isDark={isDark}>
						{originalTitle.length > 30
							? `${originalTitle.slice(0, 30)}...`
							: originalTitle}
					</Title>
					{releaseDate ? (
						<Release>{new Date(releaseDate).toLocaleDateString('ko')}</Release>
					) : null}
					{voteAverage ? <Votes rating={voteAverage} /> : null}
					<Overview>
						{overview !== '' && overview.length > 140
							? `${overview.slice(0, 140)}...`
							: overview}
					</Overview>
				</HColumn>
			</HMovie>
		</TouchableOpacity>
	);
};

const HMovie = styled.View`
	padding: 0px 30px;
	flex-direction: row;
`;

const Title = styled.Text<{ isDark: boolean }>`
	color: ${(props) => (props.isDark ? '#fff' : props.theme.textColor)};
	font-weight: 600;
	margin-top: 7px;
	margin-bottom: 5px;
`;

const HColumn = styled.View`
	padding-left: 15px;
	width: 80%;
`;

const Overview = styled.Text`
	color: #fff;
	opacity: 0.5;
	width: 80%;
`;

const Release = styled.Text`
	margin: 5px 0 10px 0;
	color: #fff;
	opacity: 0.5;
	font-size: 12px;
`;

export default HMedia;
