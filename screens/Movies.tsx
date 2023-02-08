import React from 'react';
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	useColorScheme,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Swiper from 'react-native-swiper';
import styled from 'styled-components/native';
import Slide from '../components/Slide';
import HMedia from '../components/HMedia';
import VMedia from '../components/VMedia';
import { useQuery, useQueryClient } from 'react-query';
import { MovieResponse, moviesApi } from '../api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Movies: React.FC<NativeStackScreenProps<any, 'Movies'>> = () => {
	const queryClient = useQueryClient();
	const isDark = useColorScheme() === 'dark';

	const {
		isLoading: nowPlayingLoading,
		data: nowPlayingData,
		isRefetching: isRefetchingNowPlaying,
	} = useQuery<MovieResponse>(['movies', 'nowPlaying'], moviesApi.nowPlaying);
	const {
		isLoading: upcomingLoading,
		data: upcomingData,
		isRefetching: isRefetchingUpcoming,
	} = useQuery<MovieResponse>(['movies', 'upcoming'], moviesApi.upcoming);
	const {
		isLoading: trendingLoading,
		data: trendingData,
		isRefetching: isRefetchingTrending,
	} = useQuery<MovieResponse>(['movies', 'trending'], moviesApi.trending);

	const onRefresh = async () => {
		queryClient.refetchQueries(['movies']);
	};

	const loading = nowPlayingLoading || upcomingLoading || trendingLoading;
	const refreshing =
		isRefetchingNowPlaying || isRefetchingUpcoming || isRefetchingTrending;

	return loading ? (
		<Loader>
			<ActivityIndicator />
		</Loader>
	) : upcomingData ? (
		<FlatList
			onRefresh={onRefresh}
			refreshing={refreshing}
			ListHeaderComponent={
				<>
					<Swiper
						horizontal
						loop
						autoplay
						autoplayTimeout={3.5}
						showsButtons={false}
						showsPagination={false}
						containerStyle={{
							marginBottom: 30,
							width: '100%',
							height: SCREEN_HEIGHT / 4,
						}}
					>
						{nowPlayingData?.results.map((movie) => (
							<Slide
								key={movie.id}
								backdropPath={movie.backdrop_path || ''}
								posterPath={movie.poster_path || ''}
								originalTitle={movie.original_title}
								voteAverage={movie.vote_average}
								overview={movie.overview}
							/>
						))}
					</Swiper>

					<ListContainer>
						<ListTitle isDark={isDark}>Trending Movies</ListTitle>
						{trendingData ? (
							<FlatList
								style={{ marginTop: 20 }}
								data={trendingData.results}
								keyExtractor={(item) => item.id + ''}
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={{ paddingHorizontal: 30 }}
								ItemSeparatorComponent={VSeparator}
								renderItem={({ item }) => (
									<VMedia
										posterPath={item.poster_path || ''}
										originalTitle={item.original_title}
										voteAverage={item.vote_average}
									/>
								)}
							/>
						) : null}
					</ListContainer>

					<ComingSoonTitle isDark={isDark}>Coming Soon</ComingSoonTitle>
				</>
			}
			data={upcomingData.results}
			keyExtractor={(item) => item.id + ''}
			ItemSeparatorComponent={HSeparator}
			renderItem={({ item }) => (
				<HMedia
					posterPath={item.poster_path || ''}
					originalTitle={item.original_title}
					overview={item.overview}
					releaseDate={item.release_date}
				/>
			)}
		/>
	) : null;
};

const Loader = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
`;

const ListContainer = styled.View`
	margin-bottom: 40px;
`;

const ListTitle = styled.Text<{ isDark: boolean }>`
	color: ${(props) => (props.isDark ? '#fff' : props.theme.textColor)};
	font-size: 18px;
	font-weight: 600;
	margin-left: 30px;
`;

const ComingSoonTitle = styled(ListTitle)`
	margin-bottom: 20px;
`;

const VSeparator = styled.View`
	width: 10px;
`;

const HSeparator = styled.View`
	height: 20px;
`;

export default Movies;