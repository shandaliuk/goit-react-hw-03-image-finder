import { Component } from 'react';
import { fetchImages } from 'services/fetchImages';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Application } from './App.styled';
import { Loader } from './Loader/Loader';

export class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    isLoading: false,
    error: false,
  };

  totalHits = 0;

  async componentDidUpdate(_, prevState) {
    const { page, query } = this.state;

    if (prevState.query !== query || prevState.page !== page) {
      try {
        const images = await fetchImages(query, page);
        this.totalHits = images.totalHits;
        this.setState(prevState => ({
          images: [...prevState.images, ...images.hits],
          isLoading: false,
        }));
      } catch {
        this.setState({
          query: '',
          images: [],
          page: 1,
          isLoading: false,
          error: true,
        });
      }
    }
  }

  handleSubmit = async currentQuery => {
    this.setState({
      query: currentQuery,
      images: [],
      page: 1,
      isLoading: true,
      error: false,
    });
  };

  handleClick = async () => {
    this.setState(prevState => {
      return { page: prevState.page + 1, isLoading: true };
    });
  };

  render() {
    return (
      <Application>
        <Searchbar onSubmit={this.handleSubmit} />
        <ImageGallery images={this.state.images} />
        {this.state.error && <h2>Oops, something went wrong :( Try again.</h2>}
        {this.state.images.length < this.totalHits && !this.state.isLoading && (
          <Button onClick={this.handleClick} />
        )}
        {this.state.isLoading && <Loader />}
      </Application>
    );
  }
}
