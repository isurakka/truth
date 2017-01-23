#![feature(plugin)]
#![plugin(rocket_codegen)]

use std::path::{Path, PathBuf};
use std::iter;
use std::iter::{Iterator};

extern crate rocket;
extern crate rocket_contrib;
use rocket::Request;
use rocket::response::{Redirect, NamedFile};
use rocket_contrib::{Template, JSON};

extern crate serde_json;
#[macro_use] extern crate serde_derive;

#[get("/")]
fn index() -> Template {
    Template::render("index", &false)
}

#[derive(Serialize, Deserialize, Debug)]
struct Input {
    names: Vec<String>,
    input: Vec<Vec<i8>>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Output {
    output: String,
}

#[post("/calculate", format = "application/json", data="<input>")]
fn calculate(input: JSON<Input>) -> JSON<Output> {
    println!("{:?}", input);
    return JSON(Output { output: input.input.iter()
        .map(|arr| arr.iter().enumerate()
            .map(|(i, v)| if *v == 1 { input.names[i].to_string() } else { "!".to_string() + &input.names[i] } )
            .fold("".to_string(), |acc, x| acc + x.as_str() + " && ")
            .trim_right_matches(' ')
            .trim_right_matches('&')
            .to_string())
        .fold("".to_string(), |acc, x| acc + x.as_str() + " || ")
        .trim_right_matches(' ')
        .trim_right_matches('|')
        .to_string() });
    //return JSON(Output { output: "Calculation failed".to_string() });
}

#[get("/js/<file..>")]
fn js(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("js/").join(file)).ok()
}

#[get("/css/<file..>")]
fn css(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("css/").join(file)).ok()
}

fn main() {
    rocket::ignite().mount("/", routes![index, calculate, js, css]).launch();
}