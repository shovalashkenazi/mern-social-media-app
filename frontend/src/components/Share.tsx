import React, { useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Input,
  Button,
  Image,
  Divider,
  Text,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useDispatch } from "react-redux";
import { addPost } from "../store/actions/postActions";
import img from "../assets/img2.png";
import img2 from "../assets/map.png";
import img3 from "../assets/friend.png";

const Share = () => {
  const [postContent, setPostContent] = React.useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<any>();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePostSubmit = () => {
    if (!postContent.trim()) return;
    dispatch(addPost(postContent, imageFile));
    setPostContent("");
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <Box px={7} py={5}>
      <Box
        px={10}
        py={6}
        bg="white"
        borderRadius="20px"
        boxShadow={"0px 0px 5px 0px rgba(0,0,0,0.2)"}
      >
        <Flex align={"center"} bg="white">
          <Avatar
            size="md"
            name={auth.user?.username || "User Name"}
            src={auth.user?.profileImage || "/path/to/profile.jpg"}
            mr={2}
            p={"5px"}
            boxShadow="md"
          />
          <Input
            placeholder="What's on your mind?"
            border="none"
            bg={"white"}
            _focus={{ bg: "none", borderColor: "white" }}
            borderRadius="2px"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </Flex>
        <Divider my={4} height="1px" backgroundColor="lightgray" />
        {imagePreview && (
          <Box mb={3}>
            <Image src={imagePreview} alt="Preview" borderRadius="md" />
          </Box>
        )}

        <Flex justify="space-between">
          <Flex gap={5} align="center">
            <Flex as="label" align={"center"}>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                display="none"
              />

              <Image
                src={imagePreview || img}
                alt="Preview"
                borderRadius="md"
                width="15px"
                height="15px"
                mr={2}
                cursor="pointer"
              />
              <Text cursor={"pointer"} fontSize="sm" color="gray.500">
                Add Image
              </Text>
            </Flex>
            <Flex align={"center"}>
              <Image
                src={img2}
                alt="Preview"
                borderRadius="md"
                width="15px"
                height="15px"
                mr={2}
              />
              <Text fontSize="sm" color="gray.500">
                Add Place
              </Text>
            </Flex>
            <Flex align={"center"}>
              <Image
                src={img3}
                alt="Preview"
                borderRadius="md"
                width="15px"
                height="15px"
                mr={2}
              />
              <Text fontSize="sm" color="gray.500">
                Tag Friends
              </Text>
            </Flex>
          </Flex>
          <Button
            colorScheme="blue"
            fontSize={"sm"}
            bg={"purple.300"}
            rounded={"2px"}
            h={"30px"}
            onClick={handlePostSubmit}
          >
            Share
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default Share;
