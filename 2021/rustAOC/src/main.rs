mod day1;
mod utils;
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    println!("Args are {:?}", args);
    let input = utils::file::collect_input(&args[1]);
    if let Ok(input) = input {
        day1::run(input);
    }
}
