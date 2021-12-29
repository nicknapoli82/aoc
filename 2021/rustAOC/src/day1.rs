use std::fs;
use std::process;

pub fn run(input: Vec<String>) {
    // Star 1
    let mut depth_increase = -1;
    let mut last_depth = 0;

    for line in input {
        let line: i32 = match line.trim().parse() {
            Ok(num) => num,
            Err(_) => process::exit(1),
        };

        if line > last_depth {
            depth_increase += 1;
        }
        last_depth = line;
    }

    println!("Depths = {}", depth_increase);

    // Star 2
    // depth_increase = -1;
    // last_depth = 0;
    // let lines: Vec<&str> = puzzle_input.split_whitespace().collect();
    // let chunks: Vec<i32> = Vec::with_capacity(lines.len() / 3);
    // for i in 0..chunks.len() {
    //     chunks[i] += match lines.get(i) {}
    // }

    //    for i in puzzle_input.line()
}
