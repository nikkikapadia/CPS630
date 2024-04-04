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
import { useLocation, useSearchParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";

export default function ItemsForSale() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPost, setModalPost] = useState({});

  const [saleData, setSaleData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedTags, setSelectedTags] = useState([]);


  const handleModalClose = () => {
    setModalOpen(false);
    setModalPost({});
  };

  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[1]);

  const pathname = useLocation().pathname;

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const { data, loading, fetchData } = useFetchData(
    `ads/search?category=${selectedCategory.value}&search=${search}`
  );

  const resetFilters = () => {
    setSearchValue("");
    setSelectedCategory(categories[1]);
    setPriceRange([0, 1000]);
    setFilteredData(saleData);
  };

  useEffect(() => {
    async function fetchData() {
      await fetch(`http://localhost:5001/api/ads/get/itemsForSale`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setSaleData(data);
          setFilteredData(data); // initially set filtered data to all tiems 
        }) 
        .catch((error) => {
          console.error("Error fetching wanted data:", error);
        });
    }

    fetchData();
  }, [modalPost]);

  // useEffect(() => {
  //   if (!search) return;
  //   fetchData();
  // }, [pathname, search]);

  useEffect(() => {
    // Filter saleData based on the selected category
    const results = saleData.filter(item => item.category === selectedCategory.value && item.price >= priceRange[0] && item.price <= priceRange[1]);
    setFilteredData(results);
  }, [selectedCategory, saleData, priceRange]);

//   return (
//     <>
//       <SearchBar
//         searchValue={searchValue}
//         setSearchValue={setSearchValue}
//         selectedCategory={selectedCategory}
//         setSelectedCategory={setSelectedCategory}
//       />
//       <Box sx={{ width: "95%", mx: "auto", pb: "20px" }}>
//         {loading ? (
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginTop: 5,
//             }}
//           >
//             <CircularProgress
//               size={50}
//               thickness={4}
//               style={{ color: "#213555" }}
//             />
//           </Box>
//         ) : (
//           <>
//             <Typography
//               variant="h1"
//               sx={{
//                 fontSize: "24px",
//                 fontWeight: "600",
//                 color: "#222222",
//                 mt: "30px",
//                 textAlign: "left",
//               }}
//             >
//               {data && search && `Found ${data.length}`} Items For Sale Near You
//             </Typography>
//             <Divider sx={{ my: "30px" }} />
//             <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//               {data?.length > 0 && search ? (
//                 <>
//                   {data?.map((item, ind) => {
//                     const updatedPosting = {
//                       ...item,
//                       category: "itemsForSale",
//                     };
//                     return (
//                       <ListingItem
//                         key={ind}
//                         onClick={() => {
//                           setModalOpen(true);
//                           setModalPost(updatedPosting);
//                         }}
//                         {...updatedPosting}
//                       />
//                     );
//                   })}
//                 </>
//               ) : search && data?.length === 0 ? (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     marginTop: 5,
//                   }}
//                 >
//                   <Typography>No Items Found</Typography>
//                 </Box>
//               ) : (
//                 <>
//                   {saleData.length !== 0 ? (
//                     saleData?.map((item, ind) => {
//                       const updatedPosting = {
//                         ...item,
//                         category: "itemsForSale",
//                       };
//                       return (
//                         <ListingItem
//                           key={ind}
//                           onClick={() => {
//                             setModalOpen(true);
//                             setModalPost(updatedPosting);
//                           }}
//                           {...updatedPosting}
//                         />
//                       );
//                     })
//                   ) : (
//                     <Typography
//                       variant="p"
//                       sx={{
//                         fontWeight: "600",
//                         color: "#222222",
//                         mt: "30px",
//                         textAlign: "centre",
//                       }}
//                     >
//                       No Items For Sale Near You
//                     </Typography>
//                   )}
//                 </>
//               )}
//             </Box>
//           </>
//         )}

//         <ViewPostingModal
//           open={modalOpen}
//           onClose={handleModalClose}
//           post={modalPost}
//         />
//       </Box>
//     </>
//   );
// }

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
          {categories.map((category) => (
            <MenuItem
              key={category.value}
              value={category.value}
            >
              {category.label}
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
          max={1000}
        />
      </Box>
    </Box>
    <Box sx={{ width: "95%", mx: "auto", pb: "20px" }}>
      {loading ? (
        <CircularProgress size={50} thickness={4} style={{ color: "#213555", margin: "auto" }} />
      ) : (
        <>
          <Typography variant="h1" sx={{ fontSize: "24px", fontWeight: "600", color: "#222222", mt: "30px", textAlign: "left" }}>
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
              <Typography variant="p" sx={{ fontWeight: "600", color: "#222222", mt: "30px", textAlign: "center" }}>
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
