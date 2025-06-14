import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Flex,
  Box,
  Heading,
  Button,
  Text,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useToast,
  Alert,
  AlertIcon,
  SimpleGrid,
  RadioGroup,
  Radio,
  Stack,
  Spinner
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUsers } from 'react-icons/fi';

const MotionBox = motion(Box);

const Reservation = () => {
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [reservationType, setReservationType] = useState('seat');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const slots = [];
        const startHour = reservationType === 'seat' ? 10 : 14;
        const endHour = reservationType === 'seat' ? 20 : 18;
        
        for (let hour = startHour; hour < endHour; hour++) {
          if (hour !== 13) {
            slots.push(`${hour}:00`);
            if (reservationType === 'seat') {
              slots.push(`${hour}:30`);
            }
          }
        }
        
        setAvailableSlots(slots);
      } catch (error) {
        console.error('获取可用时段失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailableSlots();
  }, [date, reservationType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!timeSlot) {
      toast({
        title: '请选择时间',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    toast({
      title: '预约成功',
      description: `${date.toDateString()} ${timeSlot}, ${partySize}人`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="container.md" mx="auto" px={4} py={8}>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Heading as="h1" size="xl" mb={8} textAlign="center" color="brand.600">
          {reservationType === 'seat' ? '座位预约' : '咖啡课程预约'}
        </Heading>

        <Flex mb={8} justify="center">
          <ButtonGroup isAttached variant="outline">
            <Button
              onClick={() => setReservationType('seat')}
              colorScheme={reservationType === 'seat' ? 'brand' : 'gray'}
              leftIcon={<FiCalendar />}
            >
              座位预约
            </Button>
            <Button
              onClick={() => setReservationType('class')}
              colorScheme={reservationType === 'class' ? 'brand' : 'gray'}
              leftIcon={<FiClock />}
            >
              咖啡课程
            </Button>
          </ButtonGroup>
        </Flex>

        <Box
          as="form"
          onSubmit={handleSubmit}
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="sm"
        >
          <Stack spacing={6}>
            <FormControl>
              <FormLabel display="flex" alignItems="center">
                <FiCalendar style={{ marginRight: '8px' }} />
                选择日期
              </FormLabel>
              <Box borderWidth="1px" borderRadius="md" p={2}>
                <DatePicker 
                  selected={date} 
                  onChange={setDate} 
                  minDate={new Date()}
                  dateFormat="yyyy/MM/dd"
                  className="custom-datepicker"
                  wrapperClassName="datepicker-wrapper"
                />
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel display="flex" alignItems="center">
                <FiClock style={{ marginRight: '8px' }} />
                选择时间
              </FormLabel>
              {isLoading ? (
                <Flex justify="center" py={4}>
                  <Spinner />
                </Flex>
              ) : (
                <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={3}>
                  {availableSlots.map(slot => (
                    <Button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      colorScheme={timeSlot === slot ? 'brand' : 'gray'}
                      variant={timeSlot === slot ? 'solid' : 'outline'}
                    >
                      {slot}
                    </Button>
                  ))}
                </SimpleGrid>
              )}
            </FormControl>

            <FormControl>
              <FormLabel display="flex" alignItems="center">
                <FiUsers style={{ marginRight: '8px' }} />
                {reservationType === 'seat' ? '人数' : '参加人数'}
              </FormLabel>
              <Select
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                focusBorderColor="brand.500"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}人</option>
                ))}
              </Select>
            </FormControl>

            {reservationType === 'class' && (
              <FormControl>
                <FormLabel>课程类型</FormLabel>
                <Select focusBorderColor="brand.500">
                  <option value="handbrew">手冲咖啡课程</option>
                  <option value="latteart">拉花艺术课程</option>
                  <option value="cupping">咖啡品鉴课程</option>
                </Select>
              </FormControl>
            )}

            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              isLoading={isLoading}
              loadingText="提交中..."
              disabled={!timeSlot}
              mt={4}
            >
              确认预约
            </Button>
          </Stack>
        </Box>
      </MotionBox>
    </Box>
  );
};

export default Reservation;