import React, { useEffect, useState } from "react";
import { Box, 
  CircularProgress, 
  Divider, 
  Typography, 
  Slider, 
  Button, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  OutlinedInput, 
  Chip } from "@mui/material";
import ListingItem from "../components/ListingItem";
import ViewPostingModal from "../components/ViewPostingModal";
import { SearchBar, categories } from "../components/SearchBar";
import useFetchData from "../hooks/useFetchData";
import { useLocation, useSearchParams } from "react-router-dom";

export default function ItemsWanted() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPost, setModalPost] = useState({});

  const [wantedData, setWantedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleModalClose = () => {
    setModalOpen(false);
    setModalPost({});
  };
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[2]);

  const pathname = useLocation().pathname;

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const { data, loading, fetchData } = useFetchData(
    `ads/search?category=${selectedCategory.value}&search=${search}`
  );

  const tagOptions = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'books', label: 'Books' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'kitchenware', label: 'Kitchenware' },
    { value: 'tutor', label: 'Tutor' },
    { value: 'housing', label: 'Housing' },
    { value: 'school', label: 'School' },
    { value: 'tools', label: 'Tools' },
    { value: 'math', label: 'Math' },
    { value: 'support', label: 'Support' },
    { value: 'pens', label: 'Pens' },
  ];

  const resetFilters = () => {
    setSearchValue("");
    setSelectedCategory(categories[0]);
    setPriceRange([0, 500]);
    setSelectedTags([]);
    setFilteredData(wantedData);
  };

  useEffect(() => {
    async function fetchData() {
      await fetch(`https://cps630.onrender.com/api/ads/get/itemsWanted`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setWantedData(data);
          setFilteredData(data);
        })
        .catch((error) => {
          console.error("Error fetching wanted data:", error);
        });
    }

    fetchData();
  }, [modalPost]);

  useEffect(() => {

    console.log("Original wantedData:", wantedData);
    console.log("Selected Tags:", selectedTags);
    console.log("Price Range:", priceRange);

    const results = wantedData.filter(item => {
      const priceMatch = item.price >= priceRange[0] && item.price <= priceRange[1];
      const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => item.tags?.includes(tag));
      return priceMatch && tagMatch;
    });

    setFilteredData(results);
  }, [wantedData, priceRange, selectedTags]);

    // Fetching data based on search
    useEffect(() => {
      if (!search) return; 
  
      const fetchSearchData = async () => {
        try {
          const response = await fetch(`https://cps630.onrender.com/api/ads/search?category=${selectedCategory.value}&search=${search}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          const searchData = await response.json();
          setWantedData(searchData);
        } catch (error) {
          console.error("Error fetching search data:", error);
        }
      };
  
      fetchSearchData();
    }, [search, selectedCategory.value]);


  return (
    <>
      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, alignItems: 'center', mt: 2 }}>
        {/* Tags Dropdown */}
        <FormControl sx={{ m: 1, minWidth: 240 }}>
          <InputLabel id="tags-select-label">Tags</InputLabel>
          <Select
            labelId="tags-select-label"
            id="tags-select"
            multiple
            value={selectedTags}
            onChange={(event) => setSelectedTags(event.target.value)}
            input={<OutlinedInput id="select-multiple-chip" label="Tags" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {tagOptions.map((tag) => (
              <MenuItem
                key={tag.value}
                value={tag.value}
              >
                {tag.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Price Range Slider */}
        <Box sx={{ width: 300, mx: 3 }}>
          <Typography id="range-slider" gutterBottom>
            Price Range
          </Typography>
          <Slider
            value={priceRange}
            onChange={(event, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={0}
            max={500}
          />
        </Box>

        {/* Reset Filters Button */}
        <Button 
          variant="outlined" 
          onClick={resetFilters} 
          sx={{ height: 'fit-content', alignSelf: 'flex-end' }}
        >
          Reset Filters
        </Button>
      </Box>


      <Box sx={{ width: "95%", mx: "auto", pb: "20px" }}>
      {loading ? (
        <CircularProgress size={50} thickness={4} style={{ 
          color: "#213555", 
          margin: "auto" }} />
      ) : (
        <>
          <Typography variant="h1" sx={{ 
            fontSize: "24px", 
            fontWeight: "600", 
            color: "#222222", 
            mt: "30px", 
            textAlign: "left" }}>
            {filteredData && filteredData.length} Items For Sale Near You
          </Typography>
          <Divider sx={{ my: "30px" }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <ListingItem
                  key={index}
                  onClick={() => {
                    setModalOpen(true);
                    setModalPost({ ...item, category: "itemsForSale" });
                  }}
                  {...item}
                />
              ))
            ) : (
              <Typography variant="p" sx={{ 
                fontWeight: "600", 
                color: "#222222", 
                mt: "30px", 
                textAlign: "center" }}>
                No Items For Sale Near You
              </Typography>
            )}
          </Box>
        </>
      )}
      <ViewPostingModal open={modalOpen} onClose={handleModalClose} post={modalPost} />
    </Box>
  </>
);
}