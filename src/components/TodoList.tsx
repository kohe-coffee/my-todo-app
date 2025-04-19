import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Paper,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  InputAdornment,
  Tooltip,
  ThemeProvider,
  createTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import EventIcon from '@mui/icons-material/Event';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LabelIcon from '@mui/icons-material/Label';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  category: string;
}

const categories = ['仕事', 'プライベート', '買い物', 'その他'];

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'category'>('priority');
  const [isLoading, setIsLoading] = useState(false);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
      },
      secondary: {
        main: '#ff4081',
        light: '#ff79b0',
        dark: '#c60055',
      },
      background: {
        default: '#f8fafc',
        paper: '#ffffff',
      },
    },
    typography: {
      h4: {
        fontWeight: 600,
        letterSpacing: '0.5px',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;
    
    if (searchText) {
      filtered = filtered.filter(todo => 
        todo.text.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  }, [todos, searchText, sortBy]);

  const handleAddTodo = () => {
    if (inputText.trim() !== '') {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputText,
          completed: false,
          priority: selectedPriority,
          dueDate,
          category: selectedCategory || 'その他',
        },
      ]);
      setInputText('');
      setSelectedCategory('');
      setSelectedPriority('medium');
      setDueDate(null);
    }
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const EmptyState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      <AssignmentIcon sx={{ fontSize: 64, color: 'primary.light', mb: 2 }} />
      <Typography variant="h6" color="textSecondary" gutterBottom>
        タスクがありません
      </Typography>
      <Typography variant="body2" color="textSecondary">
        新しいタスクを追加して始めましょう！
      </Typography>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
              Todoリスト
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="タスクを検索"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box sx={{ width: '200px' }}>
                  <FormControl fullWidth>
                    <InputLabel>並び替え</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      startAdornment={
                        <InputAdornment position="start">
                          <SortIcon color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="priority">優先度</MenuItem>
                      <MenuItem value="dueDate">期限</MenuItem>
                      <MenuItem value="category">カテゴリー</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="新しいタスクを入力"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTodo();
                    }
                  }}
                />
                <FormControl sx={{ minWidth: 140 }}>
                  <InputLabel>カテゴリー</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <LabelIcon color="action" />
                      </InputAdornment>
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 140 }}>
                  <InputLabel>優先度</InputLabel>
                  <Select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as any)}
                    startAdornment={
                      <InputAdornment position="start">
                        <PriorityHighIcon color="action" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="low">低</MenuItem>
                    <MenuItem value="medium">中</MenuItem>
                    <MenuItem value="high">高</MenuItem>
                  </Select>
                </FormControl>
                <DatePicker
                  label="期限"
                  value={dueDate}
                  onChange={(newValue) => setDueDate(newValue)}
                  slotProps={{
                    textField: {
                      sx: { minWidth: 140 },
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon color="action" />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddTodo}
                  startIcon={<AddIcon />}
                  sx={{ height: 56, px: 3 }}
                >
                  追加
                </Button>
              </Box>
            </Box>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : filteredAndSortedTodos.length === 0 ? (
              <EmptyState />
            ) : (
              <List sx={{ mt: 2 }}>
                {filteredAndSortedTodos.map((todo) => (
                  <ListItem
                    key={todo.id}
                    sx={{
                      bgcolor: 'background.paper',
                      mb: 2,
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      },
                    }}
                  >
                    <Checkbox
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo.id)}
                      color="primary"
                    />
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography
                            sx={{
                              textDecoration: todo.completed ? 'line-through' : 'none',
                              color: todo.completed ? 'text.secondary' : 'text.primary',
                              fontWeight: 500,
                            }}
                          >
                            {todo.text}
                          </Typography>
                          <Chip
                            label={todo.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ borderRadius: 1.5 }}
                          />
                          <Chip
                            label={todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                            size="small"
                            color={getPriorityColor(todo.priority)}
                            sx={{ borderRadius: 1.5 }}
                          />
                          {todo.dueDate && (
                            <Chip
                              label={todo.dueDate.toLocaleDateString('ja-JP')}
                              size="small"
                              color="info"
                              variant="outlined"
                              icon={<EventIcon />}
                              sx={{ borderRadius: 1.5 }}
                            />
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="削除">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteTodo(todo.id)}
                          sx={{
                            color: 'error.light',
                            '&:hover': {
                              color: 'error.main',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default TodoList;