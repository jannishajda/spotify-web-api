const axios = require("axios");
const qs = require("querystring");

class SpotifyWebApi {
  constructor(access_token) {
    this.access_token = access_token || null;
    if (!this.access_token) console.log("Please provide a access token!");
  }

  async performRequest(options) {
    try {
      let data = await axios({
        baseURL: "https://api.spotify.com/v1",
        headers: {
          Authorization: "Bearer " + this.access_token
        },
        reponseType: "json",
        url: options.url,
        method: options.method || "GET",
        params: options.params || null,
        data: options.data || null
      });

      return data;
    } catch (e) {
      throw e.response.data.error;
    }
  }

  /**
   *
   * Browse API
   *
   */

  /**
   * Get All Categories
   * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
   *
   * @param {String} country
   * @param {String} locale
   * @param {Integer} limit
   * @param {Integer} offset
   */

  async getCategories(country, locale, limit = 20, offset = 0) {
    return this.performRequest({
      url: "/browse/categories",
      params: {
        country,
        locale,
        limit,
        offset
      }
    });
  }

  /**
   * Get a Category
   * Get a single category used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
   *
   * @param {String} category_id
   * @param {String} country
   * @param {String} locale
   */

  async getCategory(category_id, country, locale) {
    return this.performRequest({
      url: `/browse/categories/${category_id}`,
      params: {
        country,
        locale
      }
    });
  }

  /**
   * Get a Category's Playlists
   * Get a list of Spotify playlists tagged with a particular category.
   *
   * @param {String} category_id
   * @param {String} country
   * @param {Integer} limit
   * @param {Integer} offset
   */

  async getCategoryPlaylist(category_id, country, limit = 20, offset = 0) {
    return this.performRequest({
      url: `/browse/categories/${category_id}/playlists`,
      params: {
        country,
        limit,
        offset
      }
    });
  }

  /**
   * Get Recommendations
   * Recommendations are generated based on the available information for a given seed entity and matched against
   * similar artists and tracks. If there is sufficient information about the provided seeds,
   * a list of tracks will be returned together with pool size details. For artists and tracks that are very new
   * or obscure there might not be enough data to generate a list of tracks.
   *
   * @param {Array} seed_artists
   * @param {Array} seed_genres
   * @param {Array} seed_tracks
   * @param {Integer} limit
   * @param {String} market
   * @param {Object} min_
   * @param {Object} max_
   * @param {Object} target_
   */

  async getRecommendations(
    seed_artists = [],
    seed_genres = [],
    seed_tracks = [],
    limit = 20,
    market,
    min_ = {},
    max_ = {},
    target_ = {}
  ) {
    let options = {
      url: "/recommendations",
      params: {
        seed_artists: [seed_artists].filter(Boolean).join(","),
        seed_genres: [seed_genres].filter(Boolean).join(","),
        seed_tracks: [seed_tracks].filter(Boolean).join(","),
        limit,
        market
      }
    };

    for (const [key, value] of Object.entries(min_)) {
      options.params[`min_${key}`] = value;
    }

    for (const [key, value] of Object.entries(max_)) {
      options.params[`max_${key}`] = value;
    }

    for (const [key, value] of Object.entries(target_)) {
      options.params[`target_${key}`] = value;
    }

    return this.performRequest(options);
  }

  /**
   * Get Recommendation Genres
   * Retrieve a list of available genres seed parameter values for recommendations.
   */

  async getRecommendationGenres() {
    return this.performRequest({
      url: "/recommendations/available-genre-seeds"
    });
  }

  /**
   * Get All New Releases
   * Get a list of new album releases featured in Spotify (shown, for example, on a Spotify player’s “Browse” tab).
   *
   * @param {String} country
   * @param {Integer} limit
   * @param {Integer} offset
   */

  async getNewReleases(country, limit = 20, offset = 0) {
    return this.performRequest({
      url: "/browse/new-releases",
      params: {
        country,
        limit,
        offset
      }
    });
  }

  /**
   * Get All Featured Playlists
   * Get a list of Spotify featured playlists (shown, for example, on a Spotify player’s ‘Browse’ tab).
   *
   * @param {String} country
   * @param {String} locale
   * @param {Date} timestamp
   * @param {Integer} limit
   * @param {Integer} offset
   */

  async getFeaturedPlaylists(
    country,
    locale,
    timestamp,
    limit = 20,
    offset = 0
  ) {
    return this.performRequest({
      url: "/browse/featured-playlists",
      params: {
        country,
        locale,
        timestamp,
        limit,
        offset
      }
    });
  }

  /**
   *
   * Artists API
   *
   */

  /**
   * Get Multiple Artists
   * Get Spotify catalog information for several artists based on their Spotify IDs.
   *
   * @param {Array} ids
   */

  async getArtists(ids = []) {
    return this.performRequest({
      url: "/artists",
      params: {
        ids: [ids].filter(Boolean).join(",")
      }
    });
  }

  /**
   * Get an Artist's Albums
   * Get Spotify catalog information about an artist’s albums.
   * Optional parameters can be specified in the query string to filter and sort the response.
   *
   * @param {String} id
   */

  async getArtist(id) {
    return this.performRequest({
      url: `/artists/${id}`
    });
  }

  /**
   * Get an Artist's Albums
   * Get Spotify catalog information about an artist’s albums.
   * Optional parameters can be specified in the query string to filter and sort the response.
   *
   * @param {String} id
   * @param {Array} include_groups
   * @param {String} market
   * @param {Integer} limit
   * @param {Integer} offset
   */

  async getArtistsAlbums(
    id,
    include_groups = ["single", "appears_on"],
    market,
    limit = 20,
    offset = 0
  ) {
    return this.performRequest({
      url: `/artists/${id}/albums`,
      params: {
        include_groups: [include_groups].filter(Boolean).join(","),
        market,
        limit,
        offset
      }
    });
  }

  /**
   * Get an Artist's Top Tracks
   * Get Spotify catalog information about an artist’s top tracks by country.
   *
   * @param {String} id
   * @param {String} market
   */

  async getArtistsTopTracks(id, market) {
    return this.performRequest({
      url: `/artists/${id}/top-tracks`,
      params: {
        market
      }
    });
  }

  /**
   * Get an Artist's Related Artists
   * Get Spotify catalog information about artists similar to a given artist.
   * Similarity is based on analysis of the Spotify community’s listening history.
   *
   * @param {String} id
   */

  async getRelatedArtists(id) {
    return this.performRequest({
      url: `/artists/${id}/related-artists`
    });
  }

  /**
   *
   * Player API
   *
   */

  /**
   * Get the User's Currently Playing Track
   * Get the object currently being played on the user’s Spotify account.
   *
   * @param {String} market
   */

  async getCurrentPlaying(market) {
    return this.performRequest({
      url: `/me/player/currently-playing`,
      params: {
        market
      }
    });
  }

  /**
   * Set Volume For User's Playback
   * Set the volume for the user’s current playback device.
   *
   * @param {Integer} volume_percent
   * @param {String} device_id
   */

  async setVolume(volume_percent = 50, device_id) {
    return this.performRequest({
      url: "/me/player/volume",
      method: "PUT",
      params: {
        volume_percent,
        device_id
      }
    });
  }

  /**
   * Get Information About The User's Current Playback
   * Get information about the user’s current playback state, including track, track progress, and active device.
   *
   * @param {String} market
   */

  async getPlaybackInfo(market) {
    return this.performRequest({
      url: "/me/player",
      params: {
        market
      }
    });
  }

  /**
   * Skip User’s Playback To Previous Track
   * Skips to previous track in the user’s queue.
   *
   * @param {String} device_id
   */

  async skipPrevious(device_id) {
    return this.performRequest({
      url: "/me/player/previous",
      method: "POST",
      params: {
        device_id
      }
    });
  }

  /**
   * Get Current User's Recently Played Tracks
   * Get tracks from the current user’s recently played tracks.
   *
   * @param {Integer} limit
   * @param {Integer} after
   * @param {Integer} before
   */

  async getRecentlyPlayed(limit = 20, after, before) {
    return this.performRequest({
      url: "/me/player/recently-played",
      params: {
        limit,
        after,
        before
      }
    });
  }

  /**
   * Skip User’s Playback To Next Track
   * Skips to next track in the user’s queue.
   *
   * @param {String} device_id
   */

  async skipNext(device_id) {
    return this.performRequest({
      url: "/me/player/next",
      method: "POST",
      params: {
        device_id
      }
    });
  }

  /**
   * Pause a User's Playback
   * Pause playback on the user’s account.
   *
   * @param {String} device_id
   */

  async pausePlayback(device_id) {
    return this.performRequest({
      url: "/me/player/pause",
      method: "PUT",
      params: {
        device_id
      }
    });
  }

  /**
   * Set Repeat Mode On User’s Playback
   * Set the repeat mode for the user’s playback. Options are repeat-track, repeat-context, and off.
   *
   * @param {String} state
   * @param {String} device_id
   */

  async setRepeatMode(state = "track", device_id) {
    return this.performRequest({
      url: "/me/player/repeat",
      method: "PUT",
      params: {
        state,
        device_id
      }
    });
  }

  /**
   * Start/Resume a User's Playback
   * Start/Resume a User's Playback
   *
   * @param {String} device_id
   * @param {String} context_uri
   * @param {Array} uris
   * @param {Object} offset
   * @param {integer} position_ms
   */

  async startPlayback(device_id, context_uri, uris = [], offset, position_ms) {
    return this.performRequest({
      url: "/me/player/play",
      method: "PUT",
      params: {
        device_id
      },
      data: {
        context_uri,
        uris,
        offset,
        position_ms
      }
    });
  }

  /**
   * Seek To Position In Currently Playing Track
   * Seeks to the given position in the user’s currently playing track.
   *
   * @param {Integer} position_ms
   * @param {String} device_id
   */

  async seekTo(position_ms = 0, device_id) {
    return this.performRequest({
      url: "/me/player/seek",
      method: "PUT",
      params: {
        position_ms,
        device_id
      }
    });
  }

  /**
   * Transfer a User's Playback
   * Transfer playback to a new device and determine if it should start playing.
   *
   * @param {Array} device_ids
   * @param {Boolean} play
   */

  async transferPlayback(device_ids, play) {
    return this.performRequest({
      url: "/me/player",
      method: "PUT",
      data: {
        device_ids,
        play
      }
    });
  }

  /**
   * Toggle Shuffle For User’s Playback
   * Toggle shuffle on or off for user’s playback.
   *
   * @param {Boolean} state
   * @param {String} device_id
   */

  async toggleShuffle(state, device_id) {
    return this.performRequest({
      url: "/me/player/shuffle",
      method: "PUT",
      params: {
        state,
        device_id
      }
    });
  }

  /**
   * Get a User's Available Devices
   * Get information about a user’s available devices.
   */

  async getAvailableDevices() {
    return this.performRequest({
      url: "/me/player/devices"
    });
  }

  /**
   *
   * User Profile
   *
   */

  /**
   * Get a User's Profile
   * Get public profile information about a Spotify user.
   *
   * @param {String} user_id
   */

  async getUserProfile(user_id) {
    return this.performRequest({
      url: `/users/${user_id}`
    });
  }

  /**
   * Get Current User's Profile
   * Get detailed profile information about the current user (including the current user’s username).
   */

  async getCurrentUser() {
    return this.performRequest({
      url: "/me"
    });
  }

  /**
   *
   * Follow API
   *
   */

  /**
   * Get Following State for Artists/Users
   * Check to see if the current user is following one or more artists or other Spotify users.
   *
   * @param {String} type
   * @param {Array} ids
   */

  async getFollowingState(type, ids = []) {
    return this.performRequest({
      url: "/me/following/contains",
      params: {
        type,
        ids: [ids].filter(Boolean).join(",")
      }
    });
  }

  /**
   * Check if Users Follow a Playlist
   * Check to see if one or more Spotify users are following a specified playlist.
   *
   * @param {String} playlist_id
   * @param {Array} ids
   */

  async checkIfUsersFollowPlaylist(playlist_id, ids = []) {
    return this.performRequest({
      url: `/playlists/${playlist_id}/followers/contains`,
      params: {
        ids: [ids].filter(Boolean).join(",")
      }
    });
  }

  /**
   * Follow Artists or Users
   * Add the current user as a follower of one or more artists or other Spotify users.
   *
   * @param {String} type
   * @param {Array} ids
   */

  async followUsersOrArtists(type, ids = []) {
    return this.performRequest({
      url: "/me/following",
      method: "PUT",
      params: {
        type,
        ids: [ids].filter(Boolean).join(",")
      },
      data: {
        ids: ids
      }
    });
  }

  /**
   * Follow a Playlist
   * Add the current user as a follower of a playlist.
   *
   * @param {String} playlist_id
   * @param {Boolean} visible - Public is a researved word
   */

  async followPlaylist(playlist_id, visible = true) {
    return this.performRequest({
      url: `/playlists/${playlist_id}/followers`,
      method: "PUT",
      data: { visible }
    });
  }

  /**
   * Get User's Followed Artists
   * Get the current user’s followed artists.
   *
   * @param {String} type
   * @param {Integer} limit
   * @param {String} after
   */

  async getFollowedArtists(type = "artist", limit = 20, after) {
    return this.performRequest({
      url: "/me/following",
      params: {
        type,
        limit,
        after
      }
    });
  }

  /**
   * Unfollow Artists or Users
   * Remove the current user as a follower of one or more artists or other Spotify users.
   *
   * @param {String} type
   * @param {Array} ids
   */

  async unfollowArtistsOrUsers(type, ids = []) {
    return this.performRequest({
      url: "/me/following",
      method: "DELETE",
      params: {
        type,
        ids: [ids].filter(Boolean).join(",")
      },
      data: {
        ids: ids
      }
    });
  }

  /**
   * Unfollow Playlist
   * Remove the current user as a follower of a playlist.
   *
   * @param {String} playlist_id
   */

  async unfollowPlaylist(playlist_id) {
    return this.performRequest({
      url: `/playlists/${playlist_id}/followers`
    });
  }

  /**
   *
   * Tracks API
   *
   */

  /**
   * Get a Track
   * Get Spotify catalog information for a single track identified by its unique Spotify ID.
   *
   * @param {String} id
   * @param {String} market
   */

  async getTrack(id, market) {
    return this.performRequest({
      url: `/tracks/${id}`,
      params: {
        market
      }
    });
  }

  /**
   * Get Several Tracks
   * Get Spotify catalog information for multiple tracks based on their Spotify IDs.
   *
   * @param {Array} ids
   * @param {String} market
   */

  async getTracks(ids = [], market) {
    return this.performRequest({
      url: "/tracks",
      params: {
        ids: [ids].filter(Boolean).join(","),
        market
      }
    });
  }

  /**
   * Get Audio Features for a Track
   * Get audio feature information for a single track identified by its unique Spotify ID.
   *
   * @param {String} id
   */

  async getTrackAudioFeatures(id) {
    return this.performRequest({
      url: `/audio-features/${id}`
    });
  }

  /**
   * Get Audio Features for Several Tracks
   * Get audio features for multiple tracks based on their Spotify IDs.
   *
   * @param {Array} ids
   */

  async getTracksAudioFeatures(ids) {
    return this.performRequest({
      url: "/audio-features",
      params: {
        ids: [ids].filter(Boolean).join(",")
      }
    });
  }

  /**
   * Get Audio Analysis for a Track
   * Get a detailed audio analysis for a single track identified by its unique Spotify ID.
   *
   * @param {String} id
   */

  async getTrackAudioAnalysis(id) {
    return this.performRequest({
      url: `/audio-analysis/${id}`
    });
  }

  /**
   *
   * Albums API
   *
   */

  /**
   * Get Multiple Albums
   * Get Spotify catalog information for multiple albums identified by their Spotify IDs.
   *
   * @param {Array} ids
   * @param {String} market
   */

  async getAlbums(ids, market) {
    return this.performRequest({
      url: "/albums",
      params: {
        ids: [ids].filter(Boolean).join(","),
        market
      }
    });
  }

  /**
   * Get an Album
   * Get Spotify catalog information for a single album.
   *
   * @param {String} id
   * @param {String} market
   */

  async getAlbum(id, market) {
    return this.performRequest({
      url: `/albums/${id}`,
      params: {
        market
      }
    });
  }

  /**
   *
   * @param {String} id
   * @param {Integer} limit
   * @param {Integer} offset
   * @param {String} market
   */

  async getAlbumTracks(id, limit = 20, offset = 0, market) {
    return this.performRequest({
      url: `/albums/${id}/tracks`,
      params: {
        limit,
        offset,
        market
      }
    });
  }

  /**
   *
   * Library API
   *
   */

  /**
   * Check User's Saved Albums
   * Check if one or more albums is already saved in the current Spotify user’s ‘Your Music’ library.
   *
   * @param {Array} ids
   */

  async checkSavedAlbums(ids) {
    return this.performRequest({
      url: "/me/albums/contains",
      params: {
        ids: [ids].filter(Boolean).join(",")
      }
    });
  }

  /**
   * Save Albums for Current User
   * Save one or more albums to the current user’s ‘Your Music’ library.
   *
   * @param {Array} ids
   */

  async saveAlbums(ids) {
    return this.performRequest({
      url: "/me/albums",
      method: "PUT",
      params: {
        ids: [ids].filter(Boolean).join(",")
      },
      data: {
        ids
      }
    });
  }

  /**
   * Remove Albums for Current User
   * Remove one or more albums from the current user’s ‘Your Music’ library.
   *
   * @param {Array} ids
   */

  async removeSavedAlbums(ids) {
    return this.performRequest({
      url: "/me/albums",
      method: "DELETE",
      params: {
        ids: [ids].filter(Boolean).join(",")
      },
      data: {
        ids
      }
    });
  }

  /**
   * Remove User's Saved Tracks
   * Remove one or more tracks from the current user’s ‘Your Music’ library.
   *
   * @param {Array} ids
   */

  async removeSavedTracks(ids) {
    return this.performRequest({
      url: "/me/tracks",
      method: "DELETE",
      params: {
        ids: [ids].filter(Boolean).join(",")
      }
    });
  }

  /**
   * Save Tracks for User
   * Save one or more tracks to the current user’s ‘Your Music’ library.
   *
   * @param {Array} ids
   */

  async saveTracks(ids) {
    return this.performRequest({
      url: "/me/tracks",
      method: "PUT",
      params: {
        ids: [ids].filter(Boolean).join(",")
      }
    });
  }

  /**
   * Check User's Saved Tracks
   * Check if one or more tracks is already saved in the current Spotify user’s ‘Your Music’ library.
   *
   * @param {Array} ids
   */

  async checkSavedTracks(ids) {
    return this.performRequest({
      url: "/me/tracks/contains",
      params: {
        ids: [ids].filter(Boolean).join(",")
      }
    });
  }

  /**
   * Get User's Saved Albums
   * Get a list of the albums saved in the current Spotify user’s ‘Your Music’ library.
   *
   * @param {Integer} limit
   * @param {Integer} offset
   * @param {String} market
   */

  async getSavedAlbums(limit = 20, offset = 0, market) {
    return this.performRequest({
      url: "/me/albums",
      params: {
        limit,
        offset,
        market
      }
    });
  }

  /**
   * Get User's Saved Tracks
   * Get a list of the songs saved in the current Spotify user’s ‘Your Music’ library.
   *
   * @param {Integer} limit
   * @param {Integer} offset
   * @param {String} market
   */

  async getSavedTracks(limit, offset, market) {
    return this.performRequest({
      url: "/me/tracks",
      params: {
        limit,
        offset,
        market
      }
    });
  }

  /**
   *
   * Personalization API
   *
   */

  /**
   * Get a User's Top Artists and Tracks
   * Get the current user’s top artists or tracks based on calculated affinity.
   *
   * @param {String} type
   * @param {Integer} limit
   * @param {Integer} offset
   * @param {String} time_range
   */

  async getTopArtistsTracks(
    type,
    limit = 20,
    offset = 0,
    time_range = "medium_term"
  ) {
    return this.performRequest({
      url: `/me/top/${type}`,
      params: {
        limit,
        offset,
        time_range
      }
    });
  }

  /**
   *
   * Playlists API
   *
   */

  /**
   * Get a Playlist
   * Get a playlist owned by a Spotify user.
   *
   * @param {String} playlist_id
   * @param {Array} fields
   * @param {String} market
   */

  async getPlaylist(playlist_id, fields, market) {
    return this.performRequest({
      url: `/playlists/${playlist_id}`,
      params: {
        fields: [fields].filter(Boolean).join(","),
        market
      }
    });
  }

  /**
   * Get a Playlist's Tracks
   * Get full details of the tracks of a playlist owned by a Spotify user.
   *
   * @param {String} playlist_id
   * @param {Array} fields
   * @param {Integer} limit
   * @param {Integer} offset
   * @param {Strings} market
   */

  async getPlaylistTracks(playlist_id, fields, limit = 20, offset = 0, market) {
    return this.performRequest({
      url: `/playlists/${playlist_id}/tracks`,
      params: {
        fields: [fields].filter(Boolean).join(","),
        limit,
        offset,
        market
      }
    });
  }

  /**
   * Get a Playlist Cover Image
   * Get the current image associated with a specific playlist.
   *
   * @param {String} playlist_id
   */

  async getPlaylistCover(playlist_id) {
    return this.performRequest({
      url: `/playlists/${playlist_id}/images`
    });
  }

  /**
   * Remove Tracks from a Playlist
   * Remove one or more tracks from a user’s playlist.
   *
   * @param {String} playlist_id
   * @param {Array} tracks
   * @param {String} snapshot_id
   */

  async playlistRemoveTrack(playlist_id, tracks, snapshot_id) {
    return this.performRequest({
      url: `/playlists/${playlist_id}/tracks`,
      method: "DELETE",
      data: {
        tracks,
        snapshot_id
      }
    });
  }

  /**
   * Get a List of Current User's Playlists
   * Get a list of the playlists owned or followed by the current Spotify user.
   *
   * @param {Integer} limit
   * @param {Integer} offset
   */

  async getPlaylists(limit = 20, offset = 0) {
    return this.performRequest({
      url: "/me/playlists",
      params: {
        limit,
        offset
      }
    });
  }

  /**
   * Change a Playlist's Details
   * Change a playlist’s name and public/private state. (The user must, of course, own the playlist.)
   *
   * @param {String} playlist_id
   * @param {Boolean} _public
   * @param {Boolean} collaborative
   * @param {String} description
   */

  async playlistChangeDetails(
    playlist_id,
    _public,
    collaborative,
    description
  ) {
    return this.performRequest({
      url: `/playlists/${playlist_id}`,
      method: "PUT",
      data: {
        name,
        _public,
        collaborative,
        description
      }
    });
  }

  /**
   * Replace a Playlist's Tracks
   * Replace all the tracks in a playlist, overwriting its existing tracks. This powerful request can be useful for
   * replacing tracks, re-ordering existing tracks, or clearing the playlist.
   *
   * @param {String} playlist_id
   * @param {Array} uris
   */

  async playlistReplaceTracks(playlist_id, uris) {
    return this.performRequest({
      url: `/playlists/${playlist_id}/tracks`,
      method: "PUT",
      params: {
        uirs: [uris].filter(Boolean).join(",")
      },
      data: {
        uris
      }
    });
  }

  /**
   * Add Tracks to a Playlist
   * Add one or more tracks to a user’s playlist.
   *
   * @param {String} playlist_id
   * @param {Array} uri
   * @param {Integer} position
   */

  async playlistAddTracks(playlist_id, uris, position) {
    return this.performRequest({
      url: `/playlists/${playlist_id}/tracks`,
      method: "POST",
      params: {
        uris: [uris].filter(Boolean).join(","),
        position
      },
      data: {
        uris,
        position
      }
    });
  }

  /**
   * Create a Playlist
   * Create a playlist for a Spotify user. (The playlist will be empty until you add tracks.)
   *
   * @param {String} user_id
   * @param {String} name
   * @param {Boolean} _public
   * @param {Boolean} collaborative
   * @param {String} description
   */

  async createPlaylist(user_id, name, _public, collaborative, description) {
    return this.performRequest({
      url: `/users/${user_id}/playlists`,
      method: "POST",
      data: {
        name,
        _public,
        collaborative,
        description
      }
    });
  }

  /**
   * Get a List of a User's Playlists
   * Get a list of the playlists owned or followed by a Spotify user.
   *
   * @param {String} user_id
   * @param {Integer} limit
   * @param {Integer} offset
   */

  async getUsersPlaylists(user_id, limit = 20, offset = 0) {
    return this.performRequest({
      url: `/users/${user_id}/playlists`,
      params: {
        limit,
        offset
      }
    });
  }

  /**
   * Reorder a Playlist's Tracks
   * Reorder a track or a group of tracks in a playlist.
   *
   * @param {Integer} range_start
   * @param {Integer} insert_before
   * @param {Integer} range_length
   * @param {String} snapshot_id
   */

  async playlistReorderTracks(
    range_start,
    insert_before,
    range_length,
    snapshot_id
  ) {
    this.performRequest({
      url: `/playlists/${playlist_id}/tracks`,
      method: "PUT",
      data: {
        range_start,
        insert_before,
        range_length,
        snapshot_id
      }
    });
  }

  /**
   *
   * Search API
   *
   */

  /**
   * Search for an Item
   * Get Spotify Catalog information about artists, albums, tracks or playlists that match a keyword string.
   *
   * @param {String} q
   * @param {Array} type
   * @param {String} market
   * @param {Integer} limit
   * @param {Integer} offset
   * @param {Integer} include_external
   */

  async searchItem(
    q,
    type = ["track", "artist"],
    market,
    limit = 20,
    offset = 0,
    include_external
  ) {
    return this.performRequest({
      url: "/search",
      params: {
        q: qs.escape(q),
        type: [type].filter(Boolean).join(","),
        market,
        limit,
        offset,
        include_external
      }
    });
  }
}

module.exports = SpotifyWebApi;
