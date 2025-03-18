import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Avatar,
  Button,
  VStack,
  Input,
  useColorModeValue,
  Heading,
  Spinner,
} from "@chakra-ui/react";

const suggestions = [
  {
    name: "Jane Doe",
    image:
      "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    name: "John Smith",
    image:
      "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

const latestActivities = [
  {
    name: "Jane Doe",
    image:
      "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
    activity: "changed their cover picture",
    time: "1 min ago",
  },
  {
    name: "John Smith",
    image:
      "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
    activity: "liked a post",
    time: "5 min ago",
  },
];

const onlineFriends = [
  {
    name: "Alice",
    image:
      "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    name: "Bob",
    image:
      "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    name: "Charlie",
    image:
      "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    name: "David",
    image:
      "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

const ChatGPTBox = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    // אתחול סטייטים לפני שליחת השאלה
    setLoading(true);
    setAnswer("");
    setDisplayedAnswer("");
    try {
      const response = await fetch("http://localhost:5000/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error("Error:", error);
      setAnswer("אירעה שגיאה, אנא נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  // אפקט "הקלדה" - מציג את התשובה בהדרגה, אות אחרי אות
  useEffect(() => {
    if (answer) {
      let index = 0;
      setDisplayedAnswer("");
      const interval = setInterval(() => {
        setDisplayedAnswer((prev) => prev + answer[index]);
        index++;
        if (index >= answer.length) {
          clearInterval(interval);
        }
      }, 30); // עיכוב של 30ms לכל אות (ניתן להתאים)
      return () => clearInterval(interval);
    }
  }, [answer]);

  return (
    <Box
      maxW="400px"
      p={6}
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="lg"
      boxShadow="lg"
      mt={6}
    >
      <Heading as="h3" size="md" mb={4} textAlign="left">
        Ask ChatGPT
      </Heading>
      <VStack spacing={4}>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          size="md"
          placeholder="Type your question here..."
        />
        <Button
          w="full"
          colorScheme="blue"
          onClick={handleAsk}
          _hover={{ bg: "blue.600" }}
          isDisabled={loading || !question.trim()}
        >
          {loading ? <Spinner size="sm" color="white" /> : "שלח"}
        </Button>
        {/* ניתן להוסיף Spinner נוסף למקרה שהטעינה ארוכה */}
        {loading && (
          <Box>
            <Spinner size="md" />
          </Box>
        )}
        {displayedAnswer && (
          <Box w="full" p={4} borderRadius="md" borderWidth="1px">
            <Text fontSize="sm" whiteSpace="pre-wrap">
              {displayedAnswer}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

const RightBar = () => {
  return (
    <Box
      flex="2"
      position="sticky"
      top="0"
      height="100vh"
      overflowY="auto"
      bg="#f0f0f0"
      color="black"
      display={{ base: "none", md: "block" }}
      p={5}
      sx={{
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <VStack spacing={6} align="stretch">
        {/* Suggestions Section */}
        <Box
          p={4}
          bg="white"
          borderRadius="md"
          border="1px solid #f0f0f0"
          boxShadow="sm"
        >
          <Text color="gray" fontSize="md" mb={4}>
            Suggestions For You
          </Text>
          {suggestions.map((user, index) => (
            <Flex
              key={index}
              align="center"
              justify="space-between"
              mb={3}
              p={2}
              borderRadius="md"
              boxShadow="sm"
              bg="white"
            >
              <Flex align="center" gap={3}>
                <Avatar size="sm" name={user.name} src={user.image} />
                <Text fontWeight="bold">{user.name}</Text>
              </Flex>
              <Flex gap={2}>
                <Button
                  size="xs"
                  bg="#5271ff"
                  color="white"
                  _hover={{ bg: "#3a5ecb" }}
                >
                  Follow
                </Button>
                <Button
                  size="xs"
                  bg="#f0544f"
                  color="white"
                  _hover={{ bg: "#d9443b" }}
                >
                  Dismiss
                </Button>
              </Flex>
            </Flex>
          ))}
        </Box>

        {/* Latest Activities Section */}
        <Box
          p={4}
          bg="white"
          borderRadius="md"
          border="1px solid #f0f0f0"
          boxShadow="sm"
        >
          <Text color="gray" fontSize="md" mb={4}>
            Latest Activities
          </Text>
          {latestActivities.map((activity, index) => (
            <Flex
              key={index}
              align="center"
              justify="space-between"
              mb={3}
              p={2}
              bg="white"
              borderRadius="md"
              boxShadow="sm"
            >
              <Flex align="center" gap={3}>
                <Avatar size="sm" name={activity.name} src={activity.image} />
                <Box>
                  <Text fontSize="sm">
                    <Text as="span" fontWeight="bold">
                      {activity.name}
                    </Text>{" "}
                    {activity.activity}
                  </Text>
                </Box>
              </Flex>
              <Text fontSize="xs" color="gray.500">
                {activity.time}
              </Text>
            </Flex>
          ))}
        </Box>

        {/* Online Friends Section */}
        {/* <Box
          p={4}
          bg="white"
          borderRadius="md"
          border="1px solid #f0f0f0"
          boxShadow="sm"
        >
          <Text color="gray" fontSize="md" mb={4}>
            Online Friends
          </Text>
          {onlineFriends.map((friend, index) => (
            <Flex
              key={index}
              align="center"
              p={2}
              mb={3}
              bg="white"
              borderRadius="md"
              boxShadow="sm"
            >
              <Box position="relative">
                <Avatar size="sm" name={friend.name} src={friend.image} />
                <Box
                  position="absolute"
                  bottom="0"
                  left="30px"
                  width="12px"
                  height="12px"
                  borderRadius="50%"
                  bg="limegreen"
                />
              </Box>
              <Text fontWeight="bold" ml={3}>
                {friend.name}
              </Text>
            </Flex>
          ))}
        </Box> */}

        {/* ChatGPT Integration */}
        <ChatGPTBox />
      </VStack>
    </Box>
  );
};

export default RightBar;
