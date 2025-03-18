import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Stack,
  Text,
  Avatar,
  Button,
  Image,
  useDisclosure,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Icon,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  commentPost,
  fetchPosts,
  likePost,
} from "../store/actions/postActions";
import { FcLike } from "react-icons/fc";
import { TfiCommentAlt } from "react-icons/tfi";
import { BsShare } from "react-icons/bs";
import { MdOutlineInsertComment } from "react-icons/md";

const Posts = () => {
  const posts = useSelector((state: RootState) => state.post.posts);
  const [visibleCount, setVisibleCount] = useState<number>(2);
  const avatarShadow = useColorModeValue(
    "0px 0px 5px 0px rgba(0,0,0,0.2)",
    "none"
  );
  const auth = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<any>();
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (visibleCount < posts.length && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 1, posts.length));
            setLoadingMore(false);
          }, 1500); // דילאי קצר של 300 מילי-שניות
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [posts.length, visibleCount, loadingMore]);

  const openCommentsModal = (post: any) => {
    setSelectedPost(post);
    onOpen();
  };

  const handleLike = (postId: string) => {
    dispatch(likePost(postId));
  };

  const handleCommentSubmit = (postId: string) => {
    if (!commentText[postId]?.trim()) return;
    dispatch(commentPost(postId, commentText[postId]));
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    onClose();
  };

  return (
    <Stack>
      {posts.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          No posts uploaded!
        </Text>
      ) : (
        posts.slice(0, visibleCount).map((post: any) => (
          <Box px={7} py={1}>
            <Box
              px={4}
              py={6}
              bg="white"
              borderRadius="20px"
              boxShadow={"0px 0px 5px 0px rgba(0,0,0,0.2)"}
            >
              <Flex mb={2}>
                <Avatar
                  size="sm"
                  name={auth.user?.username || "User Name"}
                  src={auth.user?.profileImage || "/path/to/profile.jpg"}
                  mr={2}
                  p={"5px"}
                  boxShadow={avatarShadow}
                />

                <Box mb={2}>
                  <Text fontWeight="bold" fontSize="sm" color="gray.600" mr={2}>
                    {post.username}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(post.createdAt).toLocaleDateString()} /{" "}
                    {new Date(post.createdAt).toLocaleTimeString()}
                  </Text>
                </Box>
              </Flex>
              <Text fontFamily={"body"} fontSize={"sm"} mb={2}>
                {post.content}
              </Text>
              {post.image && (
                <Image
                  src={`http://localhost:5000${post.image}`}
                  alt="User Post"
                  borderRadius="md"
                  h={"300px"}
                  w={"100%"}
                  mb={2}
                />
              )}

              <Flex align={"center"} gap={5}>
                {/* like */}
                <Flex gap={2} align="center">
                  <Icon
                    onClick={() => handleLike(post._id)}
                    as={FcLike as any}
                    w={6}
                    h={6}
                    cursor="pointer"
                  />
                  {post.likes.includes(auth.user?._id) ? "Unlike" : "Like"} (
                  {post.likes.length})
                </Flex>

                {/* comment */}
                <Flex gap={2} mt={1} align="center">
                  <Icon
                    onClick={() => openCommentsModal(post)}
                    as={MdOutlineInsertComment as any}
                    w={5}
                    h={5}
                    cursor="pointer"
                  />
                  <Text onClick={() => openCommentsModal(post)}>
                    {post.comments.length}
                  </Text>
                </Flex>

                {/* share */}

                <Flex gap={2} mt={1} align="center">
                  <Icon as={BsShare as any} w={4} h={4} cursor="pointer" />
                  Share
                </Flex>
              </Flex>

              <Flex align={"center"} mt={2}>
                <Input
                  h={"30px"}
                  borderRadius={"20px"}
                  placeholder="Write a comment..."
                  value={commentText[selectedPost?._id] || ""}
                  onChange={(e) =>
                    setCommentText((prev) => ({
                      ...prev,
                      [selectedPost._id]: e.target.value,
                    }))
                  }
                />
                <Button
                  ml={2}
                  size="sm"
                  colorScheme="blue"
                  borderRadius={"20px"}
                  onClick={() => handleCommentSubmit(selectedPost._id)}
                >
                  Comment
                </Button>
              </Flex>
            </Box>
          </Box>
        ))
      )}
      {/* הודעת טעינה כאשר בטעינה */}
      {loadingMore && (
        <Box textAlign="center" p={4}>
          <Text fontSize="md" color="gray.600">
            טוען פוסטים נוספים...
          </Text>
        </Box>
      )}

      {/* Comments Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Comments</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPost && (
              <Stack spacing={3}>
                {selectedPost.comments.map((comment: any) => (
                  <Flex
                    key={comment.createdAt}
                    align="center"
                    bg="gray.100"
                    p={2}
                    borderRadius="md"
                  >
                    <Avatar size="xs" src={comment.avatar} mr={2} />
                    <Box>
                      <Text fontSize="sm" fontWeight="bold">
                        {comment.username}
                      </Text>
                      <Text fontSize="sm">{comment.text}</Text>
                    </Box>
                  </Flex>
                ))}
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default Posts;
