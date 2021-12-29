use std::error::Error;
use std::fs;

pub fn collect_input(input: &str) -> Result<Vec<String>, Box<dyn Error>> {
    let puzzle_dir = "./puzzleInput";
    let mut result: Vec<String> = Vec::new();
    for entry in fs::read_dir(puzzle_dir)? {
        if let Ok(entry) = entry {
            match entry.path().to_str() {
                Some(s) => {
                    if s.contains(input) {
                        for line in fs::read_to_string(s)?.lines() {
                            result.push(line.to_string());
                        }
                    }
                }
                None => continue,
            };
        }
    }
    return Ok(result);
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn correct_file_input() {
        let result = collect_input("day1").unwrap();
        assert_eq!(result.len(), 2000);
    }
}
