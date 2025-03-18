import { Flex, Box, Image, Text } from "@chakra-ui/react";
import React from "react";

import img from "../assets/sinval-carvalho-K4o9sLBFdPk-unsplash.jpg";
import img2 from "../assets/magnus-andersson-0tODL-2pO1Y-unsplash.jpg";
import img3 from "../assets/thom-holmes-YubaAlatrIU-unsplash.jpg";
import img4 from "../assets/lerone-pieters-vF6mSAWAzzU-unsplash.jpg";

const Stories = () => {
  // Add a name property for each story
  const stories = [
    { img: img, name: "John Doe" },
    { img: img2, name: "Jane Doe" },
    { img: img3, name: "Alice" },
    { img: img4, name: "Bob" },
  ];

  return (
    <Flex gap={4} px={7} py={0} justify="space-between" align="center">
      {stories.map((story, index) => (
        <Box key={index} position="relative" height="250px" width="215px">
          <Image
            src={story.img}
            alt="Story"
            height="250px"
            width="215px"
            borderRadius="30px"
          />
          <Text
            position="absolute"
            bottom="8px"
            left="8px"
            fontWeight="bold"
            color="white"
            px={2}
            py={1}
            fontSize="sm"
          >
            {story.name}
          </Text>
        </Box>
      ))}
    </Flex>
  );
};

export default Stories;
